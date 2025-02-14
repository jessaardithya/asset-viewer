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
          .select(
            `
            id,
            asset_code,
            name,
            desc,
            condition,
            status,
            purchase_date,
            borrowable,
            category:categories(name),
            asset_images!inner(path)
          `
          )
          .eq("id", assetId)
          .single();

        if (error) throw error;

        // Debug the data
        console.log("Asset data:", data);
        console.log("Image path:", data.asset_images?.[0]?.path);

        if (data?.asset_images?.[0]?.path) {
          const imagePath = data.asset_images[0].path;
          console.log("Image path from DB:", imagePath);

          const { data: publicUrl } = supabase.storage
            .from("asset_images") // your bucket name
            .getPublicUrl(imagePath);

          console.log("Generated URL:", publicUrl);
          setImageUrl(publicUrl.publicUrl);
        }

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
        <div className="grid md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={asset.name}
                  className="w-full h-[500px] object-contain bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
                  onError={(e) => {
                    console.error("Image Load Error Details:", {
                      src: e.target.src,
                      error: e.type,
                    });
                    e.target.src = "path/to/fallback/image.png";
                  }}
                />
              ) : (
                <div className="h-[500px] bg-gray-50 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300">
                  <img 
                    src="/placeholder-image.svg" 
                    alt="No image placeholder"
                    className="w-24 h-24 mb-4 opacity-50"
                  />
                  <span className="text-gray-500 font-medium">No Image Available</span>
                  <span className="text-gray-400 text-sm mt-2">Asset image has not been uploaded</span>
                </div>
              )}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {/* Company Information */}

              <div className="mb-6">
                <div className="flex justify-between items-start">
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
                    <StatusBadge status={asset.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <DetailItem
                  icon={<Star className="text-yellow-500" />}
                  label="Category"
                  value={asset.category?.name || "Uncategorized"}
                />
                <DetailItem
                  icon={<CheckCircle className="text-green-500" />}
                  label="Condition"
                  value={asset.condition}
                />
                <DetailItem
                  icon={<Calendar className="text-blue-500" />}
                  label="Purchase Date"
                  value={new Date(asset.purchase_date).toLocaleDateString()}
                />
                <DetailItem
                  icon={
                    asset.borrowable ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )
                  }
                  label="Borrowable"
                  value={asset.borrowable ? "Yes" : "No"}
                />
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

              {asset.desc && (
                <div className="bg-indigo-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="mr-2 text-indigo-500" />
                    Asset Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{asset.desc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-4">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-lg font-semibold text-gray-900">{value}</dd>
    </div>
  </div>
);

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

const StatusBadge = ({ status }) => {
  const statusStyles = {
    available: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <CheckCircle className="inline-block mr-2 text-green-600" />,
    },
    borrowed: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <AlertTriangle className="inline-block mr-2 text-yellow-600" />,
    },
    maintenance: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: <XCircle className="inline-block mr-2 text-red-600" />,
    },
  };

  const style = statusStyles[status.toLowerCase()] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${style.bg} ${style.text}`}
    >
      {style.icon}
      {status}
    </span>
  );
};

export default AssetViewer;
