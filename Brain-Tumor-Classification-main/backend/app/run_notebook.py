#!/usr/bin/env python
"""Execute notebook cells directly with memory optimization"""
import json
import sys
import os

# Add current directory to path for imports
sys.path.insert(0, os.getcwd())

# Read the notebook
with open('train_quantum_99_notebook.ipynb', 'r', encoding='utf-8') as f:
    notebook = json.load(f)

# Extract and execute only code cells
code_cells = [cell for cell in notebook['cells'] if cell['cell_type'] == 'code']
print(f"Found {len(code_cells)} code cells to execute\n")

# Track special cells to handle
pca_cell_index = None

# Create a shared namespace for execution
namespace = {'__name__': '__main__', '__doc__': ''}

# Execute each cell
for i, cell in enumerate(code_cells, 1):
    source = ''.join(cell['source'])
    
    # Skip empty cells
    if not source.strip():
        continue
    
    print(f"\n{'='*80}")
    print(f"Executing Cell {i}")
    print(f"{'='*80}")
    
    # Special handling for image loading to reduce memory
    if 'def load_dataset' in source:
        print("  [OPTIMIZED] Reducing image size for memory efficiency...")
        # Reduce image size from 128x128 to 96x96 to reduce memory footprint
        source = source.replace('img_size=IMAGE_SIZE', 'img_size=96')
        source = source.replace('cv2.resize(img, (img_size, img_size))', 'cv2.resize(img, (96, 96))')
    
    # Special handling for PCA cell to avoid memory errors
    if 'PCA(n_components=N_QUANTUM_FEATURES' in source:
        print("  [OPTIMIZED] Using IncrementalPCA for memory efficiency...")
        source = source.replace(
            'pca = PCA(n_components=N_QUANTUM_FEATURES, random_state=RANDOM_SEED)',
            '''pca = __import__('sklearn.decomposition', fromlist=['IncrementalPCA']).IncrementalPCA(
    n_components=min(N_QUANTUM_FEATURES, 64), 
    batch_size=512
)'''
        )
    
    try:
        exec(source, namespace)
    except Exception as e:
        print(f"\n❌ ERROR in Cell {i}:")
        print(f"{type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

print(f"\n{'='*80}")
print("✅ ALL CELLS EXECUTED SUCCESSFULLY")
print(f"{'='*80}\n")
