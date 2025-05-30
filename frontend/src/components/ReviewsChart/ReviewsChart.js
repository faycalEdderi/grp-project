import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend, ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from 'recharts';
import './ReviewsChart.css';

export default function ReviewsChart() {
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('positive');
  
  useEffect(() => {
    fetchReviewData();
  }, [sortType]);
  
  const fetchReviewData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/games/analytics/reviews/?sort_type=${sortType}&limit=10`);
      const data = await response.json();
      setReviewData(data);
    } catch (error) {
      console.error("Error fetching review data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format large numbers with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };
  
  return (
    <div className="review-chart-container">
      <h3>
        {sortType === 'positive' 
          ? 'Jeux les mieux notés (% d\'avis positifs)'
          : 'Jeux avec le plus d\'avis négatifs (% d\'avis negatif)'}
      </h3>
      
      <div className="chart-controls">
        <button 
          className={sortType === 'positive' ? 'active' : ''}
          onClick={() => setSortType('positive')}
        >
          Meilleurs jeux
        </button>
        <button 
          className={sortType === 'negative' ? 'active' : ''}
          onClick={() => setSortType('negative')}
        >
          Pires jeux
        </button>
      </div>
      
      {loading ? (
        <div>Chargement des données...</div>
      ) : (
        <div style={{ width: '100%', height: 500 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={reviewData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "Score bayésien") return value.toFixed(2);
                  if (name.includes("Avis")) return formatNumber(value);
                  return value;
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const game = payload[0].payload;
                    return (
                      <div className="custom-tooltip" style={{ 
                        backgroundColor: '#fff', 
                        padding: '10px', 
                        border: '1px solid #ccc' 
                      }}>
                        <p><strong>{game.name}</strong></p>
                        <p>Avis positifs: {formatNumber(game.positive)} ({game.positive_ratio}%)</p>
                        <p>Avis négatifs: {formatNumber(game.negative)} ({game.negative_ratio}%)</p>
                        <p>Total: {formatNumber(game.total)}</p>
                        <p>{game.review_score_description}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar 
                dataKey={sortType === 'positive' ? 'positive_ratio' : 'negative_ratio'}
                name={sortType === 'positive' ? "% d'avis positifs" : "% d'avis négatifs"}
                fill={sortType === 'positive' ? '#82ca9d' : '#ff8042'}
              >
                <LabelList 
                  dataKey={sortType === 'positive' ? 'positive_ratio' : 'negative_ratio'} 
                  position="right" 
                  formatter={(value) => `${value.toFixed(2)}%`} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}