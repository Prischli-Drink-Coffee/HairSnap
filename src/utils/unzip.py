import os
import argparse
import subprocess

def unzip_and_delete(zip_folder):
    if not os.path.isdir(zip_folder):
        print(f"The folder '{zip_folder}' does not exist.")
        return

    for filename in os.listdir(zip_folder):
        if filename.endswith(".zip"):
            zip_path = os.path.join(zip_folder, filename)
            try:
                subprocess.run(["unzip", "-o", zip_path, "-d", zip_folder], check=True)
                os.remove(zip_path)
                print(f"Extracted and removed {filename}")
            except subprocess.CalledProcessError:
                print(f"Failed to unzip {filename}")

def main():
    parser = argparse.ArgumentParser(description="Unzip all .zip files in a folder and delete them after extraction.")
    parser.add_argument("folder", type=str, help="Path to the folder containing ZIP files")

    args = parser.parse_args()
    unzip_and_delete(args.folder)

if __name__ == "__main__":
    main()
