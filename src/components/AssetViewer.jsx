import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  Tag,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
} from "lucide-react";
import LogoBPT from "../assets/logobpt.png";
import supabase from "../lib/supabase"; // Import the shared client instead of creating new one

const AssetViewer = () => {
  const { assetId } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const { data, error } = await supabase
          .from("assets")
          .select(`
            id,
            asset_code,
            name,
            desc,
            condition,
            status,
            purchase_date,
            borrowable,
            category:categories(name)
          `)
          .eq("asset_code", assetId)
          .single();
  
        if (error) throw error;
  
        // Debug fetched data
        console.log("Asset data:", data);
  
        setAsset(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (assetId) fetchAsset();
  }, [assetId]);
  

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!asset) return <NotFoundState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 bg-blue-50 rounded-xl text-center p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <img
              src={LogoBPT}
              alt="BPT Logo"
              className="h-25 w-25 shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h2 className="text-3xl font-bold text-blue-800 mb-3 tracking-tight">
            PT. Blue Power Technology
          </h2>
          <p className="text-xl font-semibold text-blue-600 mb-2 italic">
            Your IT Expert Partner
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid">
          <div className="order-1 md:order-2">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {/* Company Information */}

              <div className="mb-6">
                <div className="flex justify-center items-start">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {asset.name}
                    </h1>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Tag className="text-indigo-500" size={20} />
                      <span className="text-gray-600 text-center">
                        Asset Code: {asset.asset_code}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Building2 className="mr-2 text-blue-500" />
                  Asset Ownership
                </h3>
                <p className="text-gray-700 leading-relaxed bg-yellow-100 p-4 rounded-lg border-2 border-yellow-300">
                  This asset is owned and managed by PT. Blue Power Technology,
                  a leading provider of innovative technology solutions. As part
                  of our comprehensive asset management system, this item is
                  carefully tracked and maintained to ensure optimal performance
                  and value. If you find this asset, please contact
                  admin@bluepowertechnology.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const LoadingState = () => (
  <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
      <p className="text-gray-600 text-xl">Loading Asset Details...</p>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="min-h-screen bg-red-50 flex items-center justify-center">
    <div className="text-center p-12 bg-white rounded-2xl shadow-2xl">
      <div className="text-8xl mb-6">🚨</div>
      <h3 className="text-3xl font-bold text-red-600 mb-4">Error Occurred</h3>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  </div>
);

const NotFoundState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center p-12 bg-white rounded-2xl shadow-2xl">
      <div className="text-8xl mb-6">🔍</div>
      <h3 className="text-3xl font-bold text-gray-800 mb-4">Asset Not Found</h3>
      <p className="text-gray-600 text-lg">
        The requested asset could not be located.
      </p>
    </div>
  </div>
);


export default AssetViewer;
