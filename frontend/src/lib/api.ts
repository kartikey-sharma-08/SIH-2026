export interface TransformationRequest {
  format_type: string;
  raw_text?: string;
  pdf_file?: File;
}

export interface CoreSummary {
  core_thesis: string;
  key_takeaways: string[];
  actionable_insights: string[];
  target_audience: string;
}

export interface TransformationResponse {
  format_type: string;
  core_summary: CoreSummary;
  transformed_content: string;
}

export async function generateInfographic(
  req: TransformationRequest,
): Promise<string> {
  const formData = new FormData();
  formData.append("format_type", req.format_type);

  if (req.pdf_file) {
    formData.append("pdf_file", req.pdf_file);
  } else if (req.raw_text) {
    formData.append("raw_text", req.raw_text);
  } else {
    throw new Error("Either raw_text or pdf_file must be provided");
  }

  const response = await fetch(`${API_BASE_URL}/generate-infographic`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.text().catch(() => "");
    throw new Error(errorData || `Server responded with status ${response.status}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function transformContent(
  req: TransformationRequest,
): Promise<TransformationResponse> {
  const formData = new FormData();
  formData.append("format_type", req.format_type);

  if (req.pdf_file) {
    formData.append("pdf_file", req.pdf_file);
  } else if (req.raw_text) {
    formData.append("raw_text", req.raw_text);
  } else {
    throw new Error("Either raw_text or pdf_file must be provided");
  }

  const response = await fetch(`${API_BASE_URL}/transform`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Server responded with status ${response.status}`,
    );
  }

  return await response.json();
}
