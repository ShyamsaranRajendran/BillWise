import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import pymongo
from io import BytesIO

# MongoDB connection URL and database details
url = 'mongodb://localhost:27017'
db_name = 'biller'
products_collection_name = 'products'
charts_collection_name = 'charts'

# Connect to MongoDB
client = pymongo.MongoClient(url)
db = client[db_name]
products_collection = db[products_collection_name]
charts_collection = db[charts_collection_name]

# Fetch data from MongoDB collection
data = pd.DataFrame(list(products_collection.find()))

# Convert 'average_rating' to numeric
data['average_rating'] = pd.to_numeric(data['average_rating'], errors='coerce')

def save_chart_to_db(collection, fig, chart_name):
    buf = BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    chart_data = {
        'chart_name': chart_name,
        'image': buf.getvalue()
    }
    
    # Update the document if it already exists, or insert if it doesn't
    collection.update_one({'chart_name': chart_name}, {'$set': chart_data}, upsert=True)
    
    buf.close()

# ====================
# Bar Plot: Average Rating by Brand
# ====================
plt.figure(figsize=(24, 12))
sns.set(font_scale=1.5)
order = data.groupby('brand')['average_rating'].mean().sort_values(ascending=False).index
ax = sns.barplot(x='brand', y='average_rating', data=data, estimator=pd.Series.mean, errorbar=None, order=order, palette="viridis")
plt.title('Average Rating by Brand', fontsize=20)
plt.xlabel('Brand', fontsize=16)
plt.ylabel('Average Rating', fontsize=16)
plt.xticks(rotation=90, fontsize=12)
plt.yticks(fontsize=12)

for p in ax.patches:
    ax.annotate(format(p.get_height(), '.2f'), 
                (p.get_x() + p.get_width() / 2., p.get_height()), 
                ha='center', va='center', 
                xytext=(0, 10), textcoords='offset points', fontsize=12)

save_chart_to_db(charts_collection, plt.gcf(), 'average_rating_by_brand')
plt.close()

# ====================
# Scatter Plot: Actual Price vs. Selling Price
# ====================
data['actual_price'] = pd.to_numeric(data['actual_price'].str.replace(',', ''), errors='coerce')
data['actual_price'] = data['actual_price'].fillna(data['actual_price'].mean()).astype(int)

data['selling_price'] = pd.to_numeric(data['selling_price'].str.replace(',', ''), errors='coerce')
data['selling_price'] = data['selling_price'].fillna(data['selling_price'].mean()).astype(int)

plt.figure(figsize=(12, 8))
plt.scatter(data['actual_price'], data['selling_price'], 
            s=50, alpha=0.7, c=data['selling_price'], 
            cmap='coolwarm', edgecolors='w', linewidth=0.5)
plt.xlabel('Actual Price', fontsize=16)
plt.ylabel('Selling Price', fontsize=16)
plt.title('Actual Price vs. Selling Price', fontsize=20)
plt.xscale('log')
plt.yscale('log')
plt.grid(True, which="both", ls="--", linewidth=0.5)
plt.xticks(fontsize=12)
plt.yticks(fontsize=12)
save_chart_to_db(charts_collection, plt.gcf(), 'actual_vs_selling_price')
plt.close()

# ====================
# Box Plot: Selling Price by Category
# ====================
plt.figure(figsize=(14, 8))
sns.boxplot(x='category', y='selling_price', data=data, palette="Set2")
plt.title('Selling Price by Category', fontsize=20)
plt.xlabel('Category', fontsize=16)
plt.ylabel('Selling Price', fontsize=16)
plt.xticks(rotation=90, fontsize=12)
plt.yticks(fontsize=12)
plt.yscale('log')
save_chart_to_db(charts_collection, plt.gcf(), 'selling_price_by_category')
plt.close()

# ====================
# Bar Plot: Brand Counts
# ====================
plt.figure(figsize=(24, 12))
sns.countplot(x='brand', data=data, palette="tab20")
plt.title('Brand Counts', fontsize=20)
plt.xlabel('Brand', fontsize=16)
plt.ylabel('Counts', fontsize=16)
plt.xticks(rotation=90, fontsize=12)
plt.yticks(fontsize=12)
plt.yscale('log')
save_chart_to_db(charts_collection, plt.gcf(), 'brand_counts')
plt.close()

# ====================
# Count Plot: Products by Subcategory
# ====================
plt.figure(figsize=(14, 8))
sns.countplot(x='sub_category', data=data, palette="Paired")
plt.title('Count of Products in each Subcategory', fontsize=20)
plt.xlabel('Sub Category', fontsize=16)
plt.ylabel('Counts', fontsize=16)
plt.xticks(rotation=90, fontsize=12)
plt.yticks(fontsize=12)
save_chart_to_db(charts_collection, plt.gcf(), 'products_by_subcategory')
plt.close()

# ====================
# Violin Plot: Distribution of Average Rating by Category
# ====================
plt.figure(figsize=(14, 8))
sns.violinplot(x='category', y='average_rating', data=data, palette="muted")
plt.xticks(rotation=45, fontsize=12)
plt.xlabel('Category', fontsize=16)
plt.ylabel('Average Rating', fontsize=16)
plt.title('Distribution of Average Rating by Category', fontsize=20)
save_chart_to_db(charts_collection, plt.gcf(), 'average_rating_by_category')
plt.close()

# ====================
# Heatmap: Correlation Matrix
# ====================
numeric_data = data.select_dtypes(include=[np.number])
correlation_matrix = numeric_data.corr()

plt.figure(figsize=(16, 14))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt='.2f', linewidths=0.5, annot_kws={"size": 12})
plt.title('Correlation Matrix', fontsize=20)
plt.xticks(fontsize=12)
plt.yticks(fontsize=12)
save_chart_to_db(charts_collection, plt.gcf(), 'correlation_matrix')
plt.close()

# Close the MongoDB connection
client.close()
