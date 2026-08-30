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


def render_infographic(spec: InfographicSpec) -> bytes:
    """Render an infographic as a PNG image using Pillow."""
    width, height = 1400, 900
    image = Image.new("RGB", (width, height), color=spec.background_color)
    draw = ImageDraw.Draw(image)

    accent = spec.accent_color
    title_font = _load_font("DejaVuSans-Bold.ttf", 48)
    subtitle_font = _load_font("DejaVuSans.ttf", 22)
    section_title_font = _load_font("DejaVuSans-Bold.ttf", 24)
    body_font = _load_font("DejaVuSans.ttf", 20)

    # Header strip
    draw.rounded_rectangle((60, 50, 1340, 180), radius=26, fill=accent)
    draw.text((90, 78), spec.title[:34], fill="white", font=title_font)
    draw.text((90, 130), spec.subtitle, fill=(255, 255, 255, 200), font=subtitle_font)

    # Content boxes
    box_x = 80
    box_y = 220
    box_w = 1180
    box_h = 620
    card_w = (box_w - 80) // 3
    card_h = box_h - 30

    for idx, section in enumerate(spec.sections[:3]):
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

    # Footer note
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
    temperature=0.3,
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
        "You are a visual communications strategist. Create a concise infographic plan designed for a business/technical audience.\n"
        "Use only valid JSON and no markdown fences.\n"
        "Return a JSON object matching this schema:\n"
        "{{\n"
        "  \"title\": \"Short main headline\",\n"
        "  \"subtitle\": \"Short supporting sentence\",\n"
        "  \"accent_color\": \"HEX color like #2563eb\",\n"
        "  \"background_color\": \"HEX color like #f8fafc\",\n"
        "  \"sections\": [\n"
        "    {{\"title\": \"Key Finding\", \"text\": \"up to 2 sentences\"}},\n"
        "    {{\"title\": \"Impact\", \"text\": \"up to 2 sentences\"}},\n"
        "    {{\"title\": \"Action\", \"text\": \"up to 2 sentences\"}}\n"
        "  ]\n"
        "}}\n"
        "Keep the tone clear, executive, and visual.",
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
        raise HTTPException(status_code=500, detail=f"Failed during knowledge extraction phase: {str(e)}")

    try:
        infographic_chain = INFOGRAPHIC_PROMPT | llm | JsonOutputParser(pydantic_object=InfographicSpec)
        spec_dict: dict = await infographic_chain.ainvoke({
            "summary": str(extracted_summary),
        })
        infographic_spec = InfographicSpec(**spec_dict)
    except Exception as e:
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