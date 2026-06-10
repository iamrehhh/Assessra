import sys
from PIL import Image

def remove_dark_bg(input_path, output_path, bg_color=(26, 29, 33), threshold=50):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Calculate distance from the background color
            dist = sum((item[i] - bg_color[i]) ** 2 for i in range(3)) ** 0.5
            
            if dist < threshold:
                # Calculate alpha based on distance for smooth anti-aliasing
                # If distance is 0, alpha is 0
                # If distance is threshold, alpha is 255
                alpha = int((dist / threshold) * 255)
                # Apply a curve to make the transition sharper
                alpha = int((alpha / 255) ** 1.5 * 255)
                newData.append((item[0], item[1], item[2], alpha))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print("Success")
    except Exception as e:
        print("Error:", e)
        sys.exit(1)

if __name__ == "__main__":
    remove_dark_bg(sys.argv[1], sys.argv[2], threshold=80)
