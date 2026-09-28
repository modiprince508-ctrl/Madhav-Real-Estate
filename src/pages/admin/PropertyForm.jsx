import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    transaction_type: 'Buy',
    property_type: 'Apartment',
    location: '',
    city: 'Surat',
    price: '',
    area_sqft: '',
    bhk: '',
    bathrooms: '',
    description: '',
    amenities: '', // comma separated string for simple editing
    status: 'Draft',
    featured: false
  });

  const [images, setImages] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`*, property_images(*)`)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData({
          ...data,
          amenities: data.amenities ? data.amenities.join(', ') : '',
          bathrooms: data.bathrooms || ''
        });
        // Sort images by display_order
        setImages(data.property_images?.sort((a, b) => a.display_order - b.display_order) || []);
      }
    } catch (err) {
      setError('Failed to load property');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
      
      // Auto-generate slug if title changes and not editing, or if slug is empty
      if (name === 'title' && (!isEditing || !prev.slug)) {
        newData.slug = generateSlug(value);
      }
      
      return newData;
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (!isEditing) {
      alert("Please save the property first before uploading images.");
      return;
    }

    setUploadingFiles(true);
    try {
      const uploadedImages = [];
      let currentOrder = images.length;

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `properties/${id}/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        // Insert into database
        const { data: imgData, error: dbError } = await supabase
          .from('property_images')
          .insert({
            property_id: id,
            storage_path: filePath,
            public_url: publicUrl,
            display_order: currentOrder++
          })
          .select()
          .single();

        if (dbError) throw dbError;
        uploadedImages.push(imgData);
      }

      setImages([...images, ...uploadedImages]);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading images');
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleDeleteImage = async (imageId, storagePath) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      // Delete from storage
      await supabase.storage.from('property-images').remove([storagePath]);
      
      // Delete from DB
      await supabase.from('property_images').delete().eq('id', imageId);
      
      setImages(images.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Delete image error:', err);
      alert('Failed to delete image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const amenitiesArray = formData.amenities.split(',').map(a => a.trim()).filter(Boolean);
      
      const payload = {
        title: formData.title,
        slug: formData.slug,
        transaction_type: formData.transaction_type,
        property_type: formData.property_type,
        location: formData.location,
        city: formData.city,
        price: formData.price,
        area_sqft: formData.area_sqft,
        bhk: formData.bhk,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        description: formData.description,
        amenities: amenitiesArray,
        status: formData.status,
        featured: formData.featured
      };

      if (isEditing) {
        const { error } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
        alert('Property updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('properties')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        navigate(`/admin/properties/${data.id}/edit`);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/properties" className="text-gray-500 hover:text-brand-900">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Property' : 'Add New Property'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL) *</label>
                <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                <select name="transaction_type" value={formData.transaction_type} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option>Buy</option>
                  <option>Rent</option>
                  <option>Sell</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <input required type="text" name="property_type" value={formData.property_type} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Apartment, Villa, Office" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (formatted) *</label>
                <input required type="text" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., ₹ 1.5 Cr" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (formatted) *</label>
                <input required type="text" name="area_sqft" value={formData.area_sqft} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 2500 sq.ft" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BHK</label>
                <input type="text" name="bhk" value={formData.bhk} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., 3 BHK" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows="5" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
              <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Gym, Pool, Security" />
            </div>



            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option>Draft</option>
                  <option>Available</option>
                  <option>Sold</option>
                  <option>Rented</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 text-brand-600 rounded border-gray-300 focus:ring-brand-500" />
                  <span className="text-sm font-medium text-gray-700">Featured Property</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button type="submit" disabled={saving} className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg text-white bg-brand-900 hover:bg-brand-900/90 font-medium disabled:opacity-70">
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Property Data'}
              </button>
            </div>
          </form>
        </div>

        {/* Images Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Property Images</h2>
            
            {!isEditing ? (
              <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
                Please save the property details first before uploading images.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload} 
                    disabled={uploadingFiles}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                  />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    {uploadingFiles ? 'Uploading...' : 'Click or drag images to upload'}
                  </p>
                </div>

                <div className="space-y-3">
                  {images.map((img) => (
                    <div key={img.id} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg bg-gray-50">
                      <img src={img.public_url} alt="Property" className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1 truncate">
                        <p className="text-xs text-gray-500 truncate">{img.storage_path.split('/').pop()}</p>
                      </div>
                      <button onClick={() => handleDeleteImage(img.id, img.storage_path)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {images.length === 0 && !uploadingFiles && (
                    <p className="text-sm text-gray-500 text-center py-4">No images uploaded yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
