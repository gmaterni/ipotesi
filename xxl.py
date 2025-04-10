


import base64

from bs4 import BeautifulSoup
import pypandoc

def encode_image_to_base64(image_path):
    """Encode an image to base64."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def docx2html(docx_path, html_path):
    try:
        # Convert DOCX to HTML
        output = pypandoc.convert_file(docx_path, 'html', outputfile=html_path)
        assert output == ""

        # Read the generated HTML
        with open(html_path, 'r', encoding='utf-8') as file:
            html_content = file.read()

        # Parse the HTML content
        soup = BeautifulSoup(html_content, 'html.parser')

        # Find all image tags
        img_tags = soup.find_all('img')

        # Encode images to base64 and replace the src attribute
        for img in img_tags:
            img_path = img['src']
            if img_path.startswith('./'):
                # Encode the image to base64
                img_base64 = encode_image_to_base64(img_path[2:])

                # Determine the image MIME type
                if img_path.endswith('.png'):
                    mime_type = 'image/png'
                elif img_path.endswith('.jpg') or img_path.endswith('.jpeg'):
                    mime_type = 'image/jpeg'
                elif img_path.endswith('.gif'):
                    mime_type = 'image/gif'
                else:
                    mime_type = 'image/unknown'

                # Replace the src attribute with base64 encoded image
                img['src'] = f"data:{mime_type};base64,{img_base64}"

        # Write the modified HTML back to the file
        with open(html_path, 'w', encoding='utf-8') as file:
            file.write(str(soup))

    except Exception as e:
        print(f"Errore: {e}")
        exit(1)

# The rest of your code remains unchanged.
# You can integrate this function into your existing script.

# Example usage:
# docx2html('example.docx', 'output.html')

# Note: Ensure the image paths are relative and correct in the HTML content.
