import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AssetViewer from './components/AssetViewer';
import { useEffect, useState } from 'react';
import supabase from './lib/supabase';
import './App.css'

function AssetList() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      const { data } = await supabase
        .from('assets')
        .select('id, asset_code, name')
        .limit(10);
      setAssets(data || []);
      setLoading(false);
    };

    fetchAssets();
  }, []);

  if (loading) return <div>Loading...</div>;  

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Assets</h1>
      <div className="space-y-4">
        {assets.map(asset => (
          <div key={asset.id} className="p-4 border rounded hover:bg-gray-50">
            <Link to={`/asset/${asset.id}`} className="block">
              <div className="font-medium">{asset.name}</div>
              <div className="text-sm text-gray-500">Code: {asset.asset_code}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AssetList />} />
        <Route path="/asset/:assetId" element={<AssetViewer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;