import os

# Set the root directory of your project
root_dir = r'D:\one drive\OneDrive\Desktop\sash-app\backup_sash\SASH-app'
output_file = 'project_contents.txt'

# Define folders and files to ignore
ignore_dirs = {
    'node_modules', '.git', '.expo', '.qodo', '.vscode',
    'build', 'dist', '__pycache__', 'android', 'patches', 'assets'
}

ignore_files = {
    'package-lock.json', 'yarn.lock', '.DS_Store',
    '.env', 'project.zip', 'project_contents.txt',
    'README.md', 'signup_gpt.txt', 'signup_orignal.txt',
    'test.py', 'tsconfig.json'
}

def should_ignore(path):
    # Check if path contains an ignored directory
    for ignore_dir in ignore_dirs:
        if ignore_dir in path.split(os.sep):
            return True
    # Check if file is in ignore list
    if os.path.basename(path) in ignore_files:
        return True
    return False

def write_tree_structure(outfile):
    for foldername, subfolders, filenames in os.walk(root_dir):
        # Remove ignored folders
        subfolders[:] = [d for d in subfolders if d not in ignore_dirs]
        level = foldername.replace(root_dir, '').count(os.sep)
        indent = ' ' * 4 * level
        outfile.write(f"{indent}{os.path.basename(foldername)}/\n")
        for filename in filenames:
            if should_ignore(os.path.join(foldername, filename)):
                continue
            subindent = ' ' * 4 * (level + 1)
            outfile.write(f"{subindent}{filename}\n")

def write_file_contents(outfile):
    for foldername, subfolders, filenames in os.walk(root_dir):
        for filename in filenames:
            filepath = os.path.join(foldername, filename)
            if should_ignore(filepath):
                continue
            try:
                with open(filepath, 'r', encoding='utf-8') as infile:
                    outfile.write(f'\n\n--- {filepath} ---\n')
                    outfile.write(infile.read())
            except Exception as e:
                print(f"Skipping {filepath}: {e}")

with open(output_file, 'w', encoding='utf-8') as outfile:
    outfile.write("Project Structure:\n\n")
    write_tree_structure(outfile)
    outfile.write("\n\nProject Files Content:\n")
    write_file_contents(outfile)

print(f"Finished copying project tree + files into {output_file}")
