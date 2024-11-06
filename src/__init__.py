import os
import sys
project_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
if project_path not in sys.path:
    sys.path.insert(0, project_path)


def path_to_config():
    return os.path.join(project_path, 'config.yaml')


def path_to_project():
    return os.path.join(project_path)

