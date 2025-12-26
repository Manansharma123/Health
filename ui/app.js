// ========================================
// Global State
// ========================================

const state = {
    sentimentData: [],
    brandData: [],
    categoryData: [],
    recommendations: [],
    charts: {}
};

// ========================================
// Utility Functions
// ========================================

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
}

function formatPercentage(num) {
    return (num * 100).toFixed(1) + '%';
}

function getSentimentBadge(sentiment) {
    if (sentiment === 'Positive' || sentiment > 0.5) {
        return '<span class="badge badge-positive">Positive</span>';
    } else if (sentiment === 'Negative' || sentiment < -0.5) {
        return '<span class="badge badge-negative">Negative</span>';
    } else {
        return '<span class="badge badge-neutral">Neutral</span>';
    }
}

// ========================================
// Data Loading
// ========================================

async function loadCSVData(filename) {
    return new Promise((resolve, reject) => {
        Papa.parse(`../data/processed/${filename}`, {
            download: true,
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
            error: (error) => reject(error)
        });
    });
}

async function loadAllData() {
    try {
        console.log('Loading data...');

        // Load sentiment data
        try {
            state.sentimentData = await loadCSVData('sentiment_labeled_data.csv');
            console.log(`✓ Loaded ${state.sentimentData.length} sentiment records`);
        } catch (e) {
            console.warn('Could not load sentiment_labeled_data.csv:', e);
            state.sentimentData = [];
        }

        // Load brand affinity data
        try {
            state.brandData = await loadCSVData('brand_affinity_scores.csv');
            console.log(`✓ Loaded ${state.brandData.length} brand records`);
        } catch (e) {
            console.warn('Could not load brand_affinity_scores.csv:', e);
            state.brandData = [];
        }

        // Load recommendations
        try {
            state.recommendations = await loadCSVData('top_recommendations.csv');
            console.log(`✓ Loaded ${state.recommendations.length} recommendations`);
        } catch (e) {
            console.warn('Could not load top_recommendations.csv:', e);
            state.recommendations = [];
        }

        // Initialize UI
        updateStatistics();
        createAllCharts();
        populateBrandTable();
        populateRecommendationsTable();

    } catch (error) {
        console.error('Error loading data:', error);
        showErrorMessage();
    }
}

function showErrorMessage() {
    alert('Could not load data files. Please ensure:\n1. The notebook has been run to generate CSV files\n2. Files are in ../data/processed/ directory (relative to ui/)\n3. You are running this via a local server (not file:// protocol)');
}

// ========================================
// Statistics
// ========================================

function updateStatistics() {
    const data = state.sentimentData;

    if (data.length === 0) {
        document.getElementById('total-reviews').textContent = 'N/A';
        document.getElementById('avg-rating').textContent = 'N/A';
        document.getElementById('rec-rate').textContent = 'N/A';
        document.getElementById('positive-sentiment').textContent = 'N/A';
        return;
    }

    // Total reviews
    document.getElementById('total-reviews').textContent = formatNumber(data.length);

    // Average rating
    const avgRating = data.reduce((sum, row) => sum + (row['reviews.rating'] || 0), 0) / data.length;
    document.getElementById('avg-rating').textContent = avgRating.toFixed(2);

    // Recommendation rate
    const recommendCount = data.filter(row => row['reviews.doRecommend'] === true || row['reviews.doRecommend'] === 'True').length;
    const recRate = recommendCount / data.length;
    document.getElementById('rec-rate').textContent = formatPercentage(recRate);

    // Positive sentiment
    const positiveSentiment = data.filter(row =>
        row['sentiment_combined'] === 'Positive' || row['sentiment_score'] > 0.5
    ).length / data.length;
    document.getElementById('positive-sentiment').textContent = formatPercentage(positiveSentiment);
}

// ========================================
// Chart Creation
// ========================================

const chartColors = {
    purple: 'rgba(167, 139, 250, 0.8)',
    teal: 'rgba(45, 212, 191, 0.8)',
    coral: 'rgba(251, 113, 133, 0.8)',
    blue: 'rgba(96, 165, 250, 0.8)',
    green: 'rgba(52, 211, 153, 0.8)',
    yellow: 'rgba(251, 191, 36, 0.8)',
    gradient: {
        purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        teal: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        coral: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }
};

const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#cbd5e1',
                font: { family: 'Inter', size: 12 }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(30, 39, 73, 0.95)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(167, 139, 250, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8
        }
    },
    scales: {
        x: {
            ticks: { color: '#94a3b8', font: { family: 'Inter' } },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
        },
        y: {
            ticks: { color: '#94a3b8', font: { family: 'Inter' } },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
        }
    }
};

function createAllCharts() {
    createRatingDistributionChart();
    createRecommendationChart();
    createTopBrandsChart();
    createCategoryChart();
    createSentimentComparisonChart();
    createSentimentDistributionChart();
    createBrandAffinityChart();
    createAffinityRecommendationChart();
    createModelCharts();
}

function createRatingDistributionChart() {
    const data = state.sentimentData;
    if (data.length === 0) return;

    const ratingCounts = [0, 0, 0, 0, 0];
    data.forEach(row => {
        const rating = row['reviews.rating'];
        if (rating >= 1 && rating <= 5) {
            ratingCounts[rating - 1]++;
        }
    });

    const ctx = document.getElementById('rating-distribution-chart');
    state.charts.ratingDistribution = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [{
                label: 'Number of Reviews',
                data: ratingCounts,
                backgroundColor: [
                    chartColors.coral,
                    'rgba(251, 191, 36, 0.8)',
                    chartColors.blue,
                    chartColors.teal,
                    chartColors.green
                ],
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            ...defaultChartOptions,
            plugins: {
                ...defaultChartOptions.plugins,
                legend: { display: false }
            },
            scales: {
                x: {
                    ...defaultChartOptions.scales.x,
                    title: {
                        display: true,
                        text: 'Combined Sentiment Score',
                        color: '#cbd5e1',
                        font: { family: 'Inter', size: 12 }
                    }
                },
                y: {
                    ...defaultChartOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Number of Reviews',
                        color: '#cbd5e1',
                        font: { family: 'Inter', size: 12 }
                    }
                }
            }
        }
    });
}

function createRecommendationChart() {
    const data = state.sentimentData;
    if (data.length === 0) return;

    const recommendCount = data.filter(row =>
        row['reviews.doRecommend'] === true || row['reviews.doRecommend'] === 'True'
    ).length;
    const notRecommendCount = data.length - recommendCount;

    const ctx = document.getElementById('recommendation-chart');
    state.charts.recommendation = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Would Recommend', 'Would Not Recommend'],
            datasets: [{
                data: [recommendCount, notRecommendCount],
                backgroundColor: [chartColors.green, chartColors.coral],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#cbd5e1',
                        font: { family: 'Inter', size: 12 },
                        padding: 20
                    }
                },
                tooltip: defaultChartOptions.plugins.tooltip
            }
        }
    });
}

function createTopBrandsChart() {
    const data = state.sentimentData;
    if (data.length === 0) return;

    // Count reviews by brand
    const brandCounts = {};
    data.forEach(row => {
        const brand = row['brand'] || row['brand_clean'] || 'Unknown';
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });

    // Get top 15 brands
    const topBrands = Object.entries(brandCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);

    const ctx = document.getElementById('top-brands-chart');
    state.charts.topBrands = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topBrands.map(b => b[0]),
            datasets: [{
                label: 'Number of Reviews',
                data: topBrands.map(b => b[1]),
                backgroundColor: chartColors.teal,
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            ...defaultChartOptions,
            indexAxis: 'y',
            plugins: {
                ...defaultChartOptions.plugins,
                legend: { display: false }
            }
        }
    });
}

function createCategoryChart() {
    const data = state.sentimentData;
    if (data.length === 0) return;

    // Count reviews by category
    const categoryCounts = {};
    data.forEach(row => {
        const category = row['category_level_1'] || row['categories'] || 'Unknown';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    // Get top 10 categories
    const topCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const ctx = document.getElementById('category-chart');
    state.charts.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: topCategories.map(c => c[0]),
            datasets: [{
                data: topCategories.map(c => c[1]),
                backgroundColor: [
                    chartColors.purple,
                    chartColors.teal,
                    chartColors.coral,
                    chartColors.blue,
                    chartColors.green,
                    chartColors.yellow,
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(14, 165, 233, 0.8)',
                    'rgba(234, 179, 8, 0.8)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#cbd5e1',
                        font: { family: 'Inter', size: 11 },
                        padding: 12
                    }
                },
                tooltip: defaultChartOptions.plugins.tooltip
            }
        }
    });
}

function createSentimentComparisonChart() {
    const data = state.sentimentData;
    if (data.length === 0) return;

    // Count sentiments for each approach
    const sentimentCounts = {
        rating: { Positive: 0, Neutral: 0, Negative: 0 },
        vader: { Positive: 0, Neutral: 0, Negative: 0 },
        combined: { Positive: 0, Neutral: 0, Negative: 0 }
    };

    data.forEach(row => {
        const ratingS = row['sentiment_rating'] || 'Neutral';
        const vaderS = row['sentiment_vader'] || 'Neutral';
        const combinedS = row['sentiment_combined'] || 'Neutral';

        sentimentCounts.rating[ratingS] = (sentimentCounts.rating[ratingS] || 0) + 1;
        sentimentCounts.vader[vaderS] = (sentimentCounts.vader[vaderS] || 0) + 1;
        sentimentCounts.combined[combinedS] = (sentimentCounts.combined[combinedS] || 0) + 1;
    });

    const ctx = document.getElementById('sentiment-comparison-chart');
    state.charts.sentimentComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [
                {
                    label: 'Rating-Based',
                    data: [sentimentCounts.rating.Positive, sentimentCounts.rating.Neutral, sentimentCounts.rating.Negative],
                    backgroundColor: chartColors.blue,
                    borderRadius: 6
                },
                {
                    label: 'VADER',
                    data: [sentimentCounts.vader.Positive, sentimentCounts.vader.Neutral, sentimentCounts.vader.Negative],
                    backgroundColor: chartColors.coral,
                    borderRadius: 6
                },
                {
                    label: 'Combined',
                    data: [sentimentCounts.combined.Positive, sentimentCounts.combined.Neutral, sentimentCounts.combined.Negative],
                    backgroundColor: chartColors.green,
                    borderRadius: 6
                }
            ]
        },
        options: defaultChartOptions
    });
}

function createSentimentDistributionChart() {
    const data = state.sentimentData;
    if (data.length === 0) return;

    // Get sentiment scores (combined_score ranges from 0 to 1)
    const scores = data
        .map(row => row['combined_score'])
        .filter(score => score !== null && score !== undefined && !isNaN(score));

    // Create 20 bins for better granularity (0.0 to 1.0 in steps of 0.05)
    const numBins = 20;
    const bins = Array(numBins).fill(0);
    scores.forEach(score => {
        const binIndex = Math.min(Math.floor(score * numBins), numBins - 1);
        bins[binIndex]++;
    });

    // Create labels for bins
    const labels = Array(numBins).fill(0).map((_, i) => (i * 0.05).toFixed(2));

    const ctx = document.getElementById('sentiment-distribution-chart');
    state.charts.sentimentDistribution = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Reviews',
                data: bins,
                borderColor: chartColors.purple,
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: chartColors.purple
            }]
        },
        options: {
            ...defaultChartOptions,
            plugins: {
                ...defaultChartOptions.plugins,
                legend: { display: false }
            },
            scales: {
                x: {
                    ...defaultChartOptions.scales.x,
                    title: {
                        display: true,
                        text: 'Combined Sentiment Score',
                        color: '#cbd5e1',
                        font: { family: 'Inter', size: 12 }
                    }
                },
                y: {
                    ...defaultChartOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Number of Reviews',
                        color: '#cbd5e1',
                        font: { family: 'Inter', size: 12 }
                    }
                }
            }
        }
    });
}

function createBrandAffinityChart() {
    const data = state.brandData;
    console.log('Creating brand affinity chart with data:', data.length, 'records');

    if (data.length === 0) {
        console.warn('No brand data available for chart');
        return;
    }

    // Get top 20 brands by affinity score
    const topBrands = data
        .filter(row => {
            const hasScore = row['affinity_score'] !== null &&
                row['affinity_score'] !== undefined &&
                !isNaN(row['affinity_score']);
            return hasScore;
        })
        .sort((a, b) => b['affinity_score'] - a['affinity_score'])
        .slice(0, 20);

    console.log('Top brands for chart:', topBrands.length, topBrands.slice(0, 3));

    if (topBrands.length === 0) {
        console.warn('No brands with valid affinity scores found');
        return;
    }

    const ctx = document.getElementById('brand-affinity-chart');
    if (!ctx) {
        console.error('Chart canvas element not found: brand-affinity-chart');
        return;
    }

    // Calculate appropriate scale based on data range
    const scores = topBrands.map(b => b['affinity_score']);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const range = maxScore - minScore;

    // Set axis min to show variation (use 90% of min score, or min - 10% of range)
    const axisMin = Math.max(0, minScore - (range * 0.1 || 0.01));
    const axisMax = Math.min(1.0, maxScore + (range * 0.05 || 0.005));

    console.log(`Chart scale: min=${axisMin.toFixed(3)}, max=${axisMax.toFixed(3)}, range=${range.toFixed(3)}`);

    state.charts.brandAffinity = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topBrands.map(b => b['brand_clean'] || b['brand'] || 'Unknown'),
            datasets: [{
                label: 'Affinity Score',
                data: topBrands.map(b => b['affinity_score']),
                backgroundColor: chartColors.teal,
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            ...defaultChartOptions,
            indexAxis: 'y',
            plugins: {
                ...defaultChartOptions.plugins,
                legend: { display: false }
            },
            scales: {
                x: {
                    type: 'linear',
                    min: axisMin,
                    max: axisMax,
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                },
                y: {
                    type: 'category',
                    ticks: {
                        color: '#94a3b8',
                        autoSkip: false
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    console.log('✓ Brand affinity chart created successfully');
}

function createAffinityRecommendationChart() {
    const data = state.brandData;
    if (data.length === 0) return;

    // Get top 100 brands to ensure variation in recommendation rates
    // (top 20 all have 100% recommendation rate, causing overlap)
    const topBrands = data
        .filter(row => row['affinity_score'] !== null && row['recommendation_rate'] !== null)
        .sort((a, b) => b['affinity_score'] - a['affinity_score'])
        .slice(0, 100);

    // Calculate dynamic axis ranges
    const scores = topBrands.map(b => b['affinity_score']);
    const recRates = topBrands.map(b => b['recommendation_rate']);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const minRec = Math.min(...recRates);
    const maxRec = Math.max(...recRates);
    const scoreRange = maxScore - minScore;
    const recRange = maxRec - minRec;

    const ctx = document.getElementById('affinity-recommendation-chart');
    state.charts.affinityRecommendation = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Brands',
                data: topBrands.map(b => ({
                    x: b['affinity_score'],
                    y: b['recommendation_rate'],
                    brand: b['brand_clean'] || b['brand']
                })),
                backgroundColor: chartColors.purple,
                pointRadius: 8,
                pointHoverRadius: 12
            }]
        },
        options: {
            ...defaultChartOptions,
            plugins: {
                ...defaultChartOptions.plugins,
                tooltip: {
                    ...defaultChartOptions.plugins.tooltip,
                    callbacks: {
                        label: (context) => {
                            const point = context.raw;
                            return [
                                `Brand: ${point.brand}`,
                                `Affinity Score: ${point.x.toFixed(3)}`,
                                `Rec. Rate: ${point.y.toFixed(1)}%`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    min: minScore - (scoreRange * 0.05 || 0.01),
                    max: maxScore + (scoreRange * 0.05 || 0.01),
                    title: {
                        display: true,
                        text: 'Brand Affinity Score',
                        color: '#cbd5e1',
                        font: { family: 'Inter', size: 12 }
                    },
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                },
                y: {
                    type: 'linear',
                    min: Math.max(0, minRec - (recRange * 0.1 || 2)),
                    max: Math.min(100, maxRec + (recRange * 0.1 || 2)),
                    title: {
                        display: true,
                        text: 'Recommendation Rate (%)',
                        color: '#cbd5e1',
                        font: { family: 'Inter', size: 12 }
                    },
                    ticks: {
                        color: '#94a3b8'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            }
        }
    });
}

function createModelCharts() {
    // Sample model performance data (from notebook results)
    const modelData = {
        models: ['Logistic Regression', 'Naive Bayes', 'Random Forest'],
        accuracy: [0.70, 0.65, 0.68],
        precision: [0.72, 0.67, 0.70],
        recall: [0.70, 0.65, 0.68],
        f1: [0.71, 0.66, 0.69]
    };

    // Accuracy chart
    const ctx1 = document.getElementById('model-accuracy-chart');
    state.charts.modelAccuracy = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: modelData.models,
            datasets: [{
                label: 'Accuracy',
                data: modelData.accuracy,
                backgroundColor: [chartColors.purple, chartColors.teal, chartColors.coral],
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            ...defaultChartOptions,
            plugins: {
                ...defaultChartOptions.plugins,
                legend: { display: false }
            },
            scales: {
                ...defaultChartOptions.scales,
                y: {
                    ...defaultChartOptions.scales.y,
                    max: 1.0
                }
            }
        }
    });

    // Metrics chart
    const ctx2 = document.getElementById('model-metrics-chart');
    state.charts.modelMetrics = new Chart(ctx2, {
        type: 'radar',
        data: {
            labels: modelData.models,
            datasets: [
                {
                    label: 'Precision',
                    data: modelData.precision,
                    borderColor: chartColors.blue,
                    backgroundColor: 'rgba(96, 165, 250, 0.2)',
                    borderWidth: 2
                },
                {
                    label: 'Recall',
                    data: modelData.recall,
                    borderColor: chartColors.green,
                    backgroundColor: 'rgba(52, 211, 153, 0.2)',
                    borderWidth: 2
                },
                {
                    label: 'F1-Score',
                    data: modelData.f1,
                    borderColor: chartColors.coral,
                    backgroundColor: 'rgba(251, 113, 133, 0.2)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#cbd5e1',
                        font: { family: 'Inter', size: 12 }
                    }
                },
                tooltip: defaultChartOptions.plugins.tooltip
            },
            scales: {
                r: {
                    ticks: { color: '#94a3b8', backdropColor: 'transparent' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#cbd5e1', font: { family: 'Inter', size: 11 } },
                    max: 1.0
                }
            }
        }
    });
}

// ========================================
// Tables
// ========================================

function populateBrandTable() {
    const tbody = document.getElementById('brand-table-body');
    const data = state.brandData;

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No brand data available</td></tr>';
        return;
    }

    // Sort by affinity score
    const sortedData = [...data]
        .filter(row => row['affinity_score'] !== null)
        .sort((a, b) => b['affinity_score'] - a['affinity_score'])
        .slice(0, 50);

    tbody.innerHTML = sortedData.map(row => `
    <tr>
      <td style="font-weight: 600;">${row['brand'] || row['brand_clean'] || 'Unknown'}</td>
      <td>${formatNumber(row['review_count'] || 0)}</td>
      <td>${(row['avg_rating'] || 0).toFixed(2)}</td>
      <td style="font-weight: 600; color: var(--accent-teal);">${(row['affinity_score'] || 0).toFixed(3)}</td>
      <td>${(row['recommendation_rate'] || 0).toFixed(1)}%</td>
      <td>${getSentimentBadge(row['avg_sentiment'] || 0)}</td>
    </tr>
  `).join('');
}

function populateRecommendationsTable() {
    const tbody = document.getElementById('recommendations-table-body');
    const data = state.recommendations;

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No recommendations available</td></tr>';
        return;
    }

    tbody.innerHTML = data.slice(0, 50).map(row => `
    <tr>
      <td style="font-weight: 600; max-width: 300px;">${row['name'] || row['product_name'] || 'Unknown Product'}</td>
      <td>${row['brand'] || row['brand_clean'] || 'Unknown'}</td>
      <td>${row['category'] || row['category_level_1'] || 'Unknown'}</td>
      <td style="font-weight: 600; color: var(--accent-yellow);">${(row['avg_rating'] || row['reviews.rating'] || 0).toFixed(2)} ⭐</td>
      <td>${getSentimentBadge(row['sentiment'] || row['sentiment_combined'] || 'Neutral')}</td>
      <td>${formatNumber(row['review_count'] || row['num_reviews'] || 0)}</td>
    </tr>
  `).join('');
}

// ========================================
// Search & Sort
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Brand search
    const brandSearch = document.getElementById('brand-search');
    if (brandSearch) {
        brandSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#brand-table-body tr');

            rows.forEach(row => {
                const brandName = row.cells[0]?.textContent.toLowerCase() || '';
                row.style.display = brandName.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Recommendation search
    const recSearch = document.getElementById('rec-search');
    if (recSearch) {
        recSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#recommendations-table-body tr');

            rows.forEach(row => {
                const productName = row.cells[0]?.textContent.toLowerCase() || '';
                const brandName = row.cells[1]?.textContent.toLowerCase() || '';
                row.style.display = (productName.includes(searchTerm) || brandName.includes(searchTerm)) ? '' : 'none';
            });
        });
    }
});

function sortTable(columnIndex) {
    const table = document.querySelector('#brand-table-body');
    const rows = Array.from(table.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aVal = a.cells[columnIndex].textContent;
        const bVal = b.cells[columnIndex].textContent;

        // Try numeric comparison
        const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ''));

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return bNum - aNum;
        }

        // String comparison
        return aVal.localeCompare(bVal);
    });

    rows.forEach(row => table.appendChild(row));
}

function sortRecTable(columnIndex) {
    const table = document.querySelector('#recommendations-table-body');
    const rows = Array.from(table.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aVal = a.cells[columnIndex].textContent;
        const bVal = b.cells[columnIndex].textContent;

        // Try numeric comparison
        const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ''));

        if (!isNaN(aNum) && !isNaN(bNum)) {
            return bNum - aNum;
        }

        // String comparison
        return aVal.localeCompare(bVal);
    });

    rows.forEach(row => table.appendChild(row));
}

// ========================================
// Navigation
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll navigation
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Scroll to section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Update active nav on scroll
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sentiment Analysis Dashboard initialized');
    loadAllData();
});
