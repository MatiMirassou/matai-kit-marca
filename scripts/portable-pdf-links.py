"""Resolve exported local playback links to verified sibling files in the bundle."""
import sys
from pathlib import Path
from urllib.parse import urlparse, unquote
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject
pdf_path=Path(sys.argv[1]).resolve()
local_base=sys.argv[2].rstrip("/")
reader=PdfReader(str(pdf_path))
writer=PdfWriter()
writer.clone_document_from_reader(reader)
count=0
for page in writer.pages:
    for ref in page.get("/Annots", []):
        annot=ref.get_object()
        action=annot.get("/A")
        if not action or action.get("/S")!="/URI":
            continue
        uri=str(action.get("/URI",""))
        if uri.startswith(local_base+"/"):
            rel=unquote(urlparse(uri).path).lstrip("/")
            if not rel.startswith("media/"):
                raise ValueError("Unresolved local PDF link: "+uri)
            target=(pdf_path.parent/rel).resolve()
            if not target.is_relative_to(pdf_path.parent) or not target.is_file():
                raise ValueError("Missing bundled playback file: "+rel)
            action[NameObject("/URI")]=TextStringObject("./"+rel)
            count+=1
if count==0:
    raise ValueError("No portable media links were found in the PDF")
candidate=pdf_path.with_suffix(".portable.tmp.pdf")
with candidate.open("wb") as stream:
    writer.write(stream)
candidate.replace(pdf_path)
print(str(count)+" verified portable media links")
