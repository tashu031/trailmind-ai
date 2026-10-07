import json
import re
from typing import Any, Dict, Optional

def extract_and_parse_json(text: str) -> Optional[Dict[str, Any]]:
    """
    Extracts and parses JSON from model responses, handling markdown codeblocks,
    leading/trailing prose, and common syntax issues.
    """
    if not text:
        return None
    
    text = text.strip()
    
    # 1. Try direct parse
    try:
        return json.loads(text)
    except Exception:
        pass

    # 2. Extract from markdown code fences (```json ... ``` or ``` ...)
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
    if match:
        content = match.group(1).strip()
        try:
            return json.loads(content)
        except Exception:
            pass

    # 3. Find outermost curly braces { ... }
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        candidate = text[first_brace:last_brace + 1]
        try:
            return json.loads(candidate)
        except Exception:
            # 4. Attempt basic repair (remove trailing commas before closing braces/brackets)
            repaired = re.sub(r",\s*([\]}])", r"\1", candidate)
            try:
                return json.loads(repaired)
            except Exception:
                pass

    return None
