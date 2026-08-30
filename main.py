import io
import os
import textwrap
from enum import Enum
from typing import List, Optional

import fitz  # PyMuPDF
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from PIL import Image, ImageDraw, ImageFont
from pydantic import BaseModel, Field

from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
load_dotenv()

# ==========================================
# 1. FastAPI App Setup
# ==========================================
app = FastAPI(
    title="Content Transformation Pipeline (SIH 2026)",
    description="Extracts insights from text/PDFs and transforms them into platform-specific content.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# 2. Data Models & Schemas
# ==========================================
class OutputFormat(str, Enum):
    LINKEDIN = "linkedin"
    X_THREAD = "x_thread"
    ADVISORY = "advisory"


class CoreSummary(BaseModel):
    core_thesis: str = Field(description="The primary takeaway of the document in 1 sentence.")
    key_takeaways: List[str] = Field(description="3-5 key data points or findings.")
    actionable_insights: List[str] = Field(description="Practical implications or recommendations.")
    target_audience: str = Field(description="Primary intended audience.")


class TransformationResponse(BaseModel):
    format_type: OutputFormat
    core_summary: CoreSummary
    transformed_content: str


class InfographicSection(BaseModel):
    title: str = Field(description="Short heading for this infographic block.")
    text: str = Field(description="Text content to be placed inside this block.")


class InfographicSpec(BaseModel):
    title: str = Field(description="Main headline for the infographic.")
    subtitle: str = Field(description="Short supporting line under the headline.")
    layout_style: str = Field(
        default="executive_dashboard",
        description="Choose one of: executive_dashboard, timeline, comparison, problem_solution, kpi_scorecard.",
    )
    accent_color: str = Field(default="#2563eb", description="HEX accent color for the infographic.")
    background_color: str = Field(default="#f8fafc", description="HEX background color.")
    sections: List[InfographicSection] = Field(description="Blocks to render on the infographic.")


# ==========================================
# 3. PDF Extraction Helper
# ==========================================
def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    """Extracts and cleans raw text from uploaded PDF bytes using PyMuPDF."""
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        extracted_pages = []
        for page in doc:
            text = page.get_text("text")
            # Basic layout noise removal
            cleaned_lines = [line.strip() for line in text.splitlines() if len(line.strip()) > 3]
            extracted_pages.append("\n".join(cleaned_lines))
        return "\n\n".join(extracted_pages)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process PDF file: {str(e)}")


def _wrap_text(draw: ImageDraw.ImageDraw, font: ImageFont.ImageFont, text: str, max_width: int) -> List[str]:
    """Wrap long strings to fit inside an image block."""
    paragraphs = text.split("\n")
    wrapped_lines: List[str] = []
    for paragraph in paragraphs:
        if not paragraph.strip():
            wrapped_lines.append("")
            continue
        for line in textwrap.wrap(paragraph, width=max(10, int(max_width / max(8, font.getbbox("M")[2])))):
            wrapped_lines.append(line)
    return wrapped_lines


def _load_font(font_name: str, size: int) -> ImageFont.ImageFont:
    """Try the requested font, then gracefully fall back to PIL defaults if it is unavailable."""
    candidates = [
        font_name,
        os.path.join(os.getcwd(), "fonts", font_name),
        os.path.join("C:\\Windows\\Fonts", font_name),
        os.path.join("C:\\Windows\\Fonts", "arial.ttf"),
        os.path.join("C:\\Windows\\Fonts", "calibri.ttf"),
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]

    for candidate in candidates:
        if not candidate:
            continue
        try:
            if os.path.exists(candidate):
                return ImageFont.truetype(candidate, size)
        except (OSError, TypeError, ValueError):
            continue

    try:
        return ImageFont.truetype(font_name, size)
    except (OSError, TypeError, ValueError):
        return ImageFont.load_default()


def _fallback_infographic_spec(document_text: str) -> InfographicSpec:
    """Create a deterministic infographic when the external AI service is unavailable."""
    cleaned = " ".join(document_text.split())
    sentences = [s.strip() for s in cleaned.split(".") if s.strip()]
    title = "Strategic Overview"
    subtitle = "Operational summary generated from the provided source material"
    if sentences:
        title = sentences[0][:72].strip() or title
        subtitle = "Key insights extracted from the source content"

    lower_doc = cleaned.lower()
    if any(word in lower_doc for word in ["timeline", "roadmap", "phase", "launch", "sequence", "milestone"]):
        layout_style = "timeline"
    elif any(word in lower_doc for word in ["compare", "comparison", "versus", "option", "alternative"]):
        layout_style = "comparison"
    elif any(word in lower_doc for word in ["problem", "challenge", "risk", "issue", "barrier"]):
        layout_style = "problem_solution"
    elif any(word in lower_doc for word in ["kpi", "metric", "performance", "impact", "outcome", "result"]):
        layout_style = "kpi_scorecard"
    else:
        layout_style = "executive_dashboard"

    section_texts = [
        "The source document highlights the main operational challenge, strategic context, and the urgency behind the issue.",
        "The central insight is that the organization needs a more structured and measurable pathway to improve execution and decision quality.",
        "The likely impact includes slower delivery, uneven adoption, and reduced confidence across teams and stakeholders.",
        "The recommended response is to align priorities, clarify ownership, and focus on the most actionable next steps.",
        "Expected value includes stronger visibility, better coordination, and more confident outcomes across the organization.",
    ]
    section_titles = ["Context", "Key Insight", "Impact", "Recommendation", "Outcome"]

    sections = [
        InfographicSection(title=section_titles[i], text=section_texts[i])
        for i in range(len(section_titles))
    ]

    return InfographicSpec(
        title=title[:34],
        subtitle=subtitle,
        layout_style=layout_style,
        accent_color="#2563eb",
        background_color="#f8fafc",
        sections=sections,
    )


def render_infographic(spec: InfographicSpec) -> bytes:
    """Render an infographic as a PNG image using a layout chosen by the model."""
    width, height = 1400, 900
    image = Image.new("RGB", (width, height), color=spec.background_color)
    draw = ImageDraw.Draw(image)

    accent = spec.accent_color
    title_font = _load_font("DejaVuSans-Bold.ttf", 48)
    subtitle_font = _load_font("DejaVuSans.ttf", 22)
    section_title_font = _load_font("DejaVuSans-Bold.ttf", 24)
    body_font = _load_font("DejaVuSans.ttf", 20)

    draw.rounded_rectangle((60, 50, 1340, 180), radius=26, fill=accent)
    draw.text((90, 78), spec.title[:34], fill="white", font=title_font)
    draw.text((90, 130), spec.subtitle, fill=(255, 255, 255, 200), font=subtitle_font)

    layout = (spec.layout_style or "executive_dashboard").strip().lower().replace(" ", "_")
    sections = spec.sections[:5]

    if layout == "timeline":
        for idx, section in enumerate(sections):
            y = 220 + idx * 125
            circle_x = 150
            line_x = 150
            draw.line((line_x, 220, line_x, 720), fill=accent, width=4)
            draw.ellipse((circle_x - 16, y - 12, circle_x + 16, y + 12), fill=accent)
            draw.rounded_rectangle((190, y - 24, 1260, y + 76), radius=16, fill=(255, 255, 255, 220))
            draw.text((220, y - 6), section.title, fill="black", font=section_title_font)
            wrapped = _wrap_text(draw, body_font, section.text, max_width=980)
            current_y = y + 28
            for line in wrapped[:2]:
                draw.text((220, current_y), line, fill=(30, 41, 59), font=body_font)
                current_y += int(body_font.getbbox("Ag")[3]) + 6
    elif layout == "comparison":
        left = sections[0] if sections else InfographicSection(title="Context", text="")
        right = sections[1] if len(sections) > 1 else InfographicSection(title="Impact", text="")
        left_box = (90, 230, 650, 760)
        right_box = (750, 230, 1310, 760)
        for box in (left_box, right_box):
            draw.rounded_rectangle(box, radius=22, fill=(255, 255, 255, 220))
        draw.text((120, 260), left.title, fill="black", font=section_title_font)
        draw.text((780, 260), right.title, fill="black", font=section_title_font)
        for idx, text in enumerate(_wrap_text(draw, body_font, left.text, max_width=500)[:7]):
            draw.text((120, 310 + idx * 42), text, fill=(30, 41, 59), font=body_font)
        for idx, text in enumerate(_wrap_text(draw, body_font, right.text, max_width=500)[:7]):
            draw.text((780, 310 + idx * 42), text, fill=(30, 41, 59), font=body_font)
    elif layout == "problem_solution":
        problem = sections[0] if sections else InfographicSection(title="Problem", text="")
        solution = sections[1] if len(sections) > 1 else InfographicSection(title="Action", text="")
        draw.rounded_rectangle((90, 230, 660, 760), radius=22, fill=(255, 255, 255, 220))
        draw.rounded_rectangle((760, 230, 1310, 760), radius=22, fill=accent)
        draw.text((120, 260), problem.title, fill="black", font=section_title_font)
        draw.text((790, 260), solution.title, fill="white", font=section_title_font)
        for idx, text in enumerate(_wrap_text(draw, body_font, problem.text, max_width=500)[:8]):
            draw.text((120, 310 + idx * 42), text, fill=(30, 41, 59), font=body_font)
        for idx, text in enumerate(_wrap_text(draw, body_font, solution.text, max_width=450)[:8]):
            draw.text((790, 310 + idx * 42), text, fill="white", font=body_font)
    elif layout == "kpi_scorecard":
        cols = 2
        rows = 2
        for idx, section in enumerate(sections[:4]):
            col = idx % cols
            row = idx // cols
            x0 = 120 + col * 600
            y0 = 240 + row * 220
            draw.rounded_rectangle((x0, y0, x0 + 510, y0 + 170), radius=18, fill=(255, 255, 255, 220))
            draw.rounded_rectangle((x0 + 18, y0 + 20, x0 + 46, y0 + 48), radius=8, fill=accent)
            draw.text((x0 + 60, y0 + 18), section.title, fill="black", font=section_title_font)
            for jdx, text in enumerate(_wrap_text(draw, body_font, section.text, max_width=440)[:4]):
                draw.text((x0 + 28, y0 + 68 + jdx * 28), text, fill=(30, 41, 59), font=body_font)
    else:
        box_x = 80
        box_y = 220
        box_w = 1180
        box_h = 620
        card_w = (box_w - 80) // 3
        card_h = box_h - 30
        for idx, section in enumerate(sections[:3]):
            x0 = box_x + idx * (card_w + 30)
            y0 = box_y
            x1 = x0 + card_w
            y1 = y0 + card_h
            draw.rounded_rectangle((x0, y0, x1, y1), radius=22, fill=(255, 255, 255, 220))
            draw.rounded_rectangle((x0 + 18, y0 + 18, x0 + 40, y0 + 40), radius=8, fill=accent)
            draw.text((x0 + 58, y0 + 18), section.title, fill="black", font=section_title_font)
            lines = _wrap_text(draw, body_font, section.text, max_width=card_w - 60)
            line_height = int(body_font.getbbox("Ag")[3]) + 8
            current_y = y0 + 80
            for line in lines[:11]:
                if line == "":
                    current_y += line_height
                    continue
                draw.text((x0 + 24, current_y), line, fill=(30, 41, 59), font=body_font)
                current_y += line_height

    draw.text((90, 840), "Generated by TransformAI infographic pipeline", fill=(51, 65, 85), font=subtitle_font)

    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


# ==========================================
# 4. LangChain LCEL Pipeline Initialization
# ==========================================
# Initialize LLM (Model agnostic - swap with ChatGoogleGenerativeAI or ChatAnthropic seamlessly)
llm = ChatGoogleGenerativeAI(
    model="gemini-3.6-flash",
    temperature=0.8,
)

# ------------------------------------------
# Step A: Knowledge Extraction Chain
# ------------------------------------------
json_parser = JsonOutputParser(pydantic_object=CoreSummary)

extraction_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an expert research analyst. Read the provided source document carefully "
        "and extract a structured json summary.\n{format_instructions}",
    ),
    ("human", "Source Document Content:\n\n{document_text}"),
])

extraction_chain = extraction_prompt | llm | json_parser


# ------------------------------------------
# Step B: Format Specific Transformation Prompts
# ------------------------------------------
PROMPT_TEMPLATES = {
    OutputFormat.LINKEDIN: ChatPromptTemplate.from_messages([
        (
            "system",
            "You are an elite social media strategist.\n"
            "Task: Transform the provided Core Summary into a high-engagement LinkedIn post.\n\n"
            "Formatting Rules:\n"
            "- HOOK: Strong opening sentence challenging an assumption or stating a bold metric.\n"
            "- CONTEXT: 2 brief sentences setting the foundation.\n"
            "- BULLETS: 3-4 concise points using relevant emojis as visual cues.\n"
            "- TAKEAWAY: 1 sharp closing sentence.\n"
            "- CTA: End with an open-ended question to drive comment section engagement.\n"
            "- Do NOT use markdown headers (##). Keep under 250 words.",
        ),
        ("human", "Core Summary Input:\n{summary}"),
    ]),
    
    OutputFormat.X_THREAD: ChatPromptTemplate.from_messages([
        (
            "system",
            "You are a viral tech/business writer on X (Twitter).\n"
            "Task: Convert the provided Core Summary into a 4-tweet thread.\n\n"
            "Formatting Rules:\n"
            "- Tweet 1: Clear hook + main takeaway + [Thread 🧵] tag.\n"
            "- Tweets 2-3: Core data points and actionable insights (1 main point per tweet).\n"
            "- Tweet 4: Final summary + call to action (retweet/follow).\n"
            "- Separate each tweet explicitly with '---'.\n"
            "- Ensure every single tweet is under 270 characters.",
        ),
        ("human", "Core Summary Input:\n{summary}"),
    ]),
    
    OutputFormat.ADVISORY: ChatPromptTemplate.from_messages([
        (
            "system",
            "You are a Principal Management Consultant.\n"
            "Task: Draft a formal Executive Advisory Report from the provided Core Summary.\n\n"
            "Formatting Rules:\n"
            "- Use bold standalone labels for section headers (e.g. **EXECUTIVE SUMMARY**).\n"
            "- Include an **IMPACT MATRIX** using a Markdown Table with columns: | Finding | Risk Level | Recommended Action |\n"
            "- Keep tone objective, precise, and analytical.\n"
            "- End with short-term (0-30 days) and long-term priority next steps.",
        ),
        ("human", "Core Summary Input:\n{summary}"),
    ]),
}


INFOGRAPHIC_PROMPT = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are a senior visual strategist and analyst creating executive-ready infographic content for a business and technical audience.\n"
        "Create a distinct infographic plan based only on the provided summary.\n"
        "Choose exactly one visual layout_style from this list and make the content fit that format:\n"
        "- executive_dashboard\n"
        "- timeline\n"
        "- comparison\n"
        "- problem_solution\n"
        "- kpi_scorecard\n"
        "Use valid JSON only. No markdown fences, no commentary, no extra text.\n"
        "Return a JSON object matching this exact schema:\n"
        "{{\n"
        "  \"title\": \"Short but high-impact headline\",\n"
        "  \"subtitle\": \"Clear supporting sentence explaining the key idea\",\n"
        "  \"layout_style\": \"executive_dashboard\" | \"timeline\" | \"comparison\" | \"problem_solution\" | \"kpi_scorecard\",\n"
        "  \"accent_color\": \"HEX color like #2563eb\",\n"
        "  \"background_color\": \"HEX color like #f8fafc\",\n"
        "  \"sections\": [\n"
        "    {{\"title\": \"Key Context\", \"text\": \"1-2 sentences describing the issue or situation\"}},\n"
        "    {{\"title\": \"Key Insight\", \"text\": \"1-2 sentences explaining the major finding\"}},\n"
        "    {{\"title\": \"Impact\", \"text\": \"1-2 sentences describing the business or strategic consequence\"}},\n"
        "    {{\"title\": \"Recommendation\", \"text\": \"1-2 sentences describing the action to take\"}},\n"
        "    {{\"title\": \"Outcome\", \"text\": \"1-2 sentences describing expected value or result\"}}\n"
        "  ]\n"
        "}}\n"
        "Guidelines:\n"
        "- Make the layout_style genuinely different across outputs when the content supports it.\n"
        "- Keep the content executive, crisp, fact-driven, and easy to scan.\n"
        "- Prefer concrete business implications over vague wording.\n"
        "- For timeline, emphasize sequence or progression; for comparison, contrast options; for problem_solution, show challenge and remedy; for kpi_scorecard, highlight measurable outcomes; for executive_dashboard, emphasize leadership summary.\n"
        "- Ensure the title is strong and memorable, not generic.\n"
        "- Keep the JSON schema exactly valid and complete.\n"
        "- Do not invent numbers, metrics, or facts that are not supported by the summary.\n",
    ),
    ("human", "Core Summary Input:\n{summary}"),
])


# ==========================================
# 5. FastAPI Endpoint Logic
# ==========================================
@app.post("/transform", response_model=TransformationResponse)
async def transform_document(
    format_type: OutputFormat = Form(..., description="Target output template"),
    raw_text: Optional[str] = Form(None, description="Direct string text input"),
    pdf_file: Optional[UploadFile] = File(None, description="PDF File upload"),
):
    # Validate Input Source
    if not raw_text and pdf_file is None:
        raise HTTPException(status_code=400, detail="Provide either 'raw_text' or a 'pdf_file'.")

    # 1. Extraction Layer
    document_text = ""
    if pdf_file is not None:
        filename = getattr(pdf_file, "filename", None)
        if not filename or not filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Uploaded file must be a PDF.")
        contents = await pdf_file.read()
        document_text = extract_text_from_pdf_bytes(contents)
    elif raw_text:
        document_text = raw_text

    if len(document_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Provided text is too short to process.")

    # 2. Step 1 Chain: Extract Core Knowledge
    try:
        extracted_summary: dict = await extraction_chain.ainvoke({
            "document_text": document_text,
            "format_instructions": json_parser.get_format_instructions(),
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed during knowledge extraction phase: {str(e)}")

    # 3. Step 2 Chain: Execute Format Transformation
    try:
        transformation_prompt = PROMPT_TEMPLATES[format_type]
        transformation_chain = transformation_prompt | llm | StrOutputParser()

        transformed_output: str = await transformation_chain.ainvoke({
            "summary": str(extracted_summary)
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed during format transformation phase: {str(e)}")

    # 4. Return Combined Output Response
    return TransformationResponse(
        format_type=format_type,
        core_summary=CoreSummary(**extracted_summary),
        transformed_content=transformed_output,
    )


@app.post("/generate-infographic")
async def generate_infographic(
    format_type: OutputFormat = Form(OutputFormat.ADVISORY, description="Target content tone for the infographic"),
    raw_text: Optional[str] = Form(None, description="Direct string text input"),
    pdf_file: Optional[UploadFile] = File(None, description="PDF File upload"),
):
    """Extract content from text/PDF, convert it into a compact infographic plan, and return the rendered PNG."""
    if not raw_text and pdf_file is None:
        raise HTTPException(status_code=400, detail="Provide either 'raw_text' or a 'pdf_file'.")

    document_text = ""
    if pdf_file is not None:
        filename = getattr(pdf_file, "filename", None)
        if not filename or not filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Uploaded file must be a PDF.")
        contents = await pdf_file.read()
        document_text = extract_text_from_pdf_bytes(contents)
    elif raw_text:
        document_text = raw_text

    if len(document_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Provided text is too short to process.")

    try:
        extracted_summary: dict = await extraction_chain.ainvoke({
            "document_text": document_text,
            "format_instructions": json_parser.get_format_instructions(),
        })
    except Exception as e:
        err_text = str(e)
        if "429" in err_text or "RESOURCE_EXHAUSTED" in err_text or "quota" in err_text.lower():
            infographic_spec = _fallback_infographic_spec(document_text)
        else:
            raise HTTPException(status_code=500, detail=f"Failed during knowledge extraction phase: {str(e)}")
    else:
        try:
            infographic_chain = INFOGRAPHIC_PROMPT | llm | JsonOutputParser(pydantic_object=InfographicSpec)
            spec_dict: dict = await infographic_chain.ainvoke({
                "summary": str(extracted_summary),
            })
            infographic_spec = InfographicSpec(**spec_dict)
        except Exception as e:
            err_text = str(e)
            if "429" in err_text or "RESOURCE_EXHAUSTED" in err_text or "quota" in err_text.lower():
                infographic_spec = _fallback_infographic_spec(document_text)
            else:
                raise HTTPException(status_code=500, detail=f"Failed during infographic generation: {str(e)}")

    png_bytes = render_infographic(infographic_spec)
    return Response(
        content=png_bytes,
        media_type="image/png",
        headers={"Content-Disposition": 'inline; filename="infographic.png"'},
    )


# ==========================================
# 6. Local Server Execution
# ==========================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)