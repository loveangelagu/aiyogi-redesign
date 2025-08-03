import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from "carousels" table
        const fetchCarousels = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('carousels').select('*');
            console.log('Data:', data); // Log the fetched data
            console.log('Error:', error); // Log any error
            if (error) {
                setError(error.message);
                setCarousels([]);
            } else {
                setCarousels(data);
                setError(null);
            }
            setLoading(false);
        };

        fetchCarousels();
    }, []);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1>Carousels Data</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && !error && carousels.length === 0 && <p>No carousels found.</p>}
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {carousels.map((carousel) => (
                    <li key={carousel.id} style={{ background: '#f0f0f0', marginBottom: '16px', padding: '12px', borderRadius: '8px' }}>
                        <Link to={`/start-journey/${carousel.id}`}>
                            <h2>{carousel.name}</h2>
                            <p>{carousel.description}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
