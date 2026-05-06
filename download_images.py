import urllib.request
import os

images = {
  'image1.png': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200', # Dental clinic
  'image2.png': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200', # Perfect smile / veneers
  'image3.png': 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=1200', # Male hair
  'image4.png': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800', # Male patient testimonial
  'image5.png': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800', # Female patient testimonial
  'image6.png': 'https://images.unsplash.com/photo-1534643960519-11ad79bc19df?auto=format&fit=crop&q=80&w=800', # Before DSD
  'image7.png': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800', # After DSD
  'image8.png': 'https://images.unsplash.com/photo-1598256989800-fea5ce599b82?auto=format&fit=crop&q=80&w=1200', # Dental blog
  'image9.png': 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1200', # Hair blog / female hair / eyebrow
  'image10.png': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800', # Female Doctor
}

base_dir = r"c:\Users\Shahm.s\Desktop\Gravity Clinic\clinic_images"

for filename, url in images.items():
    filepath = os.path.join(base_dir, filename)
    print(f"Downloading {filename}...")
    try:
        urllib.request.urlretrieve(url, filepath)
        print(f"Saved {filepath}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

print("Done downloading images.")
