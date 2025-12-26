## Important Note About Dataset

The project is configured to analyze the **full dataset** (`GrammarandProductReviews.csv` with 71,045 reviews).

### Performance Considerations

Due to the large dataset size:
- **Data processing** may take 2-5 minutes
- **Sentiment analysis** (VADER + preprocessing) may take 10-15 minutes
- **Model training** may take 5-10 minutes depending on your hardware
- **Total pipeline execution** may take 20-30 minutes

### Running with Sample Data (Optional)

If you want faster testing with a smaller sample:

```python
# In any module's main() function, add this after loading the data:
df = df.sample(n=1000, random_state=42)  # Use 1,000 random reviews
```

### Recommended Approach

1. **First run:** Use sample data (1,000-5,000 reviews) to test the pipeline
2. **Production run:** Use full dataset for comprehensive analysis
3. **Incremental analysis:** Process data in batches if memory is limited

### Memory Requirements

- **Minimum:** 4GB RAM
- **Recommended:** 8GB+ RAM for full dataset
- **Optimal:** 16GB RAM for smooth processing

The system will automatically handle the data efficiently, but processing time will scale with dataset size.
