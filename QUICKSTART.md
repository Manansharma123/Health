#  Super Quick Start

## Option 1: Open in VS Code (Easiest!)

1. **Open the notebook file:**
   - In VS Code, go to: `File` → `Open File`
   - Navigate to: `sentiment_recommendation_system/notebooks/complete_analysis.ipynb`
   - OR just click on the file in VS Code's file explorer

2. **Select Python kernel:**
   - VS Code will ask you to select a kernel
   - Choose: `sentiment_recommendation_system/venv/bin/python`
   - (This is your virtual environment with all packages)

3. **Run all cells:**
   - Click the "Run All" button at the top
   - OR press `Ctrl+Shift+P` and type "Run All Cells"

**That's it!**  No terminal commands needed!

---

## Option 2: Use Jupyter in Browser

If you prefer the classic Jupyter interface:

```bash
cd sentiment_recommendation_system
source venv/bin/activate
jupyter notebook notebooks/complete_analysis.ipynb
```

---

##  First Time Setup (One-time only)

If packages aren't installed yet:

1. Open VS Code terminal
2. Run:
```bash
cd sentiment_recommendation_system
source venv/bin/activate
pip install pandas numpy matplotlib seaborn scikit-learn nltk wordcloud ipykernel
```

3. Then open the notebook and run!

---

##  Recommended: Use VS Code

**Why?**
-  No browser needed
-  Better code editing
-  Inline visualizations
-  Easy debugging
-  One-click "Run All"

**Just open the `.ipynb` file in VS Code and click "Run All"!** 
