# Product Review Sentiment Analysis & Recommendation System

A comprehensive sentiment analysis and recommendation system analyzing **71,045 product reviews** using a single interactive Jupyter notebook.

##  Project Overview

This project performs end-to-end sentiment analysis on e-commerce product reviews:
- Multi-approach sentiment analysis (Rating-based, VADER, Combined scoring)
- Brand affinity and performance metrics
- Content-based recommendation engine
- Machine learning classification models
- Interactive visualizations

##  Quick Start

### 1. Setup Environment

```bash
cd sentiment_recommendation_system

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install pandas numpy matplotlib seaborn scikit-learn nltk wordcloud jupyter
```

### 2. Download NLTK Data

```python
import nltk
nltk.download('vader_lexicon')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')
```

### 3. How to View Results

You have **two options** to view the sentiment analysis:

#### Option A: Web Dashboard  (Quick View - Recommended)

Start a local server to view the interactive dashboard:

```bash
cd sentiment_recommendation_system
python3 -m http.server 8000
# Open in browser: http://localhost:8000/ui/
```

**Features:**
-  Overview statistics and key metrics
-  Interactive charts (ratings, brands, sentiment trends)
-  Brand affinity scores with dynamic visualizations
-  Top product recommendations
-  ML model performance

**Note:** Keep the server running while viewing. Press `Ctrl+C` to stop.

#### Option B: Jupyter Notebook  (Full Analysis)

Run the complete analysis to process data and generate results:

```bash
jupyter notebook notebooks/complete_analysis.ipynb
```

Then **run all cells sequentially** to:
- Process raw review data
- Generate sentiment scores
- Create visualizations
- Train ML models
- Export CSV files (used by the dashboard)

---

##  Project Structure

```
sentiment_recommendation_system/
 data/
    raw/
       GrammarandProductReviews.csv    # Original dataset (71,045 reviews)
    processed/                           # Generated outputs (CSV files)
    models/                              # Saved ML models
 notebooks/
    complete_analysis.ipynb              #  MAIN NOTEBOOK - Run this!
 ui/                                      #  Web Dashboard
    index.html                           # Dashboard HTML
    app.js                               # Interactive charts & data loading
    styles.css                           # Dashboard styling
 requirements.txt                         # Python dependencies
 README.md                                # This file
 DATASET_INFO.md                          # Dataset usage guide
```

##  Notebook Contents

The `complete_analysis.ipynb` notebook includes:

1. **Setup & Data Loading** - Environment setup and data import
2. **Phase 1: Data Exploration** - Statistics, visualizations, quality analysis
3. **Phase 2: Brand & Category Extraction** - Hierarchical parsing and mapping
4. **Phase 3: Sentiment Analysis** - Rating-based, VADER, and combined scoring
5. **Phase 4: Brand Affinity Analysis** - Performance metrics and insights
6. **Phase 5: Recommendation System** - Content-based filtering with quality filters
7. **Phase 6: ML Model Training** - Train and evaluate 3 classification models
8. **Summary & Insights** - Key findings and business recommendations

##  Key Features

-  **All-in-one notebook** - Complete analysis in a single file
-  **Interactive visualizations** - 15+ charts and plots
-  **Multiple ML models** - Logistic Regression, Naive Bayes, Random Forest
-  **Flexible dataset size** - Use full dataset or sample for testing
-  **Automated outputs** - Saves processed data, models, and recommendations
-  **Well-documented** - Markdown explanations for each step

##  Sample Results

Based on the 100-row sample analysis:

### Dataset Statistics
- **Total Reviews:** 71,045 (full dataset)
- **Average Rating:** 3.06/5.0
- **Recommendation Rate:** 59%

### Top Brands (by Affinity Score)
1. **AMBI** - 1.00 (Perfect score, 100% recommendation)
2. **J.R. Watkins** - 0.92 (5.0 avg rating, 83% recommendation)
3. **Johnson's** - 0.78 (3.81 avg rating, 81% recommendation)

### ML Model Performance
- **Best Model:** Logistic Regression
- **Accuracy:** 70%
- **F1-Score (Positive):** 0.74

##  Performance Considerations

### Full Dataset (71,045 reviews)
- **Processing time:** 20-30 minutes
- **Memory required:** 8GB+ RAM recommended

### Sample Dataset (1,000-5,000 reviews)
- **Processing time:** 2-5 minutes
- **Memory required:** 4GB RAM

**Tip:** Start with a sample to test the notebook, then run with full data for production analysis.

To use a sample, modify the data loading cell:
```python
# Load sample instead of full dataset
df = pd.read_csv(DATA_PATH, nrows=5000)  # First 5,000 rows
# OR
df = pd.read_csv(DATA_PATH).sample(n=5000, random_state=42)  # Random 5,000
```

##  Generated Outputs

After running the notebook, you'll find:

### Data Files (`data/processed/`)
- `sentiment_labeled_data.csv` - Complete dataset with sentiment scores
- `brand_category_mapping.csv` - Brand-category relationships
- `brand_affinity_scores.csv` - Brand performance metrics
- `top_recommendations.csv` - Product recommendations

### Model Files (`data/models/`)
- `sentiment_classifier.pkl` - Trained classification model
- `tfidf_vectorizer.pkl` - Text vectorizer

##  What You'll Learn

- How to perform comprehensive sentiment analysis
- Multi-approach sentiment scoring techniques
- Building recommendation systems
- Training and evaluating ML models
- Extracting business insights from review data
- Data visualization best practices

##  Dependencies

```
pandas>=2.0.0
numpy>=1.24.0
matplotlib>=3.7.0
seaborn>=0.12.0
scikit-learn>=1.3.0
nltk>=3.8.0
wordcloud>=1.9.0
jupyter>=1.0.0
```

##  Tips

1. **Run cells sequentially** - Each section builds on previous ones
2. **Check memory usage** - Monitor RAM if using full dataset
3. **Save your work** - Notebook auto-saves, but manually save important results
4. **Customize analysis** - Modify parameters to explore different insights
5. **Export visualizations** - Right-click charts to save as images

##  Troubleshooting

**Issue:** Out of memory error
- **Solution:** Use a smaller sample size or increase available RAM

**Issue:** NLTK data not found
- **Solution:** Run the NLTK download commands in the notebook

**Issue:** Slow processing
- **Solution:** Reduce dataset size or use more powerful hardware

##  Learn More

- **VADER Sentiment:** [NLTK VADER Documentation](https://www.nltk.org/howto/sentiment.html)
- **TF-IDF:** [Scikit-learn TfidfVectorizer](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html)
- **Recommendation Systems:** [Content-Based Filtering](https://en.wikipedia.org/wiki/Recommender_system#Content-based_filtering)

##  License

This project is for educational purposes.

##  Author

Created as a comprehensive sentiment analysis and recommendation system demonstration.

---

**Ready to start?** 

-  **Quick view:** Run `python3 -m http.server 8000` and open http://localhost:8000/ui/
-  **Full analysis:** Open `notebooks/complete_analysis.ipynb` and run all cells! 
