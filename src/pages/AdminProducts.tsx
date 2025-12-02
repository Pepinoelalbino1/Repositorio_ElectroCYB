import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Image as ImageIcon, Save } from 'lucide-react';
import {
  getProductos,
  Producto,
  createProducto,
  updateProducto,
  deleteProducto,
  uploadProductoImage,
  SaveProductoPayload,
} from '../api/products';
import { formatPriceWithSymbol } from '../config/currency';

interface CaracteristicaRow {
  key: string;
  value: string;
}

const AdminProducts: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  const [formData, setFormData] = useState<SaveProductoPayload>({
    nombre: '',
    precio: '',
    imagen: '',
    descripcion: '',
    categoria: '',
    stock: '',
  });

  // 👇 Estado local para manejar características como filas {key, value}
  const [caracteristicas, setCaracteristicas] = useState<CaracteristicaRow[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const loadProductos = async () => {
    try {
      setIsLoading(true);
      const data = await getProductos();
      setProductos(data);
      setError(null);
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar los productos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormData({
      nombre: '',
      precio: '',
      imagen: '',
      descripcion: '',
      categoria: '',
      stock: '',
    });
    setCaracteristicas([]); // limpiar características
  };

  const handleEditProduct = (p: Producto) => {
    setEditingProduct(p);
    setFormData({
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagen,
      descripcion: p.descripcion,
      categoria: p.categoria,
      stock: p.stock != null ? p.stock.toString() : '',
    });

    // Cargar características existentes en filas {key, value}
    if (p.caracteristicas) {
      const rows: CaracteristicaRow[] = Object.entries(p.caracteristicas).map(([key, value]) => ({
        key,
        value,
      }));
      setCaracteristicas(rows);
    } else {
      setCaracteristicas([]);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await deleteProducto(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
      alert('Error al eliminar el producto');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const url = await uploadProductoImage(file);
      setFormData((prev) => ({
        ...prev,
        imagen: url,
      }));
    } catch (e) {
      console.error(e);
      alert('Error al subir la imagen');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // 👇 Manejo del CRUD de características en el formulario

  const handleAddCaracteristica = () => {
    setCaracteristicas((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleCaracteristicaChange = (index: number, field: 'key' | 'value', value: string) => {
    setCaracteristicas((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleRemoveCaracteristica = (index: number) => {
    setCaracteristicas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!formData.precio.trim()) {
      alert('El precio es obligatorio');
      return;
    }
    if (formData.stock == null || formData.stock.toString().trim() === '') {
      alert('El stock es obligatorio');
      return;
    }

    // Convertir filas {key, value} a Record<string, string>
    const caracteristicasPayload: Record<string, string> = {};
    caracteristicas.forEach(({ key, value }) => {
      const k = key.trim();
      const v = value.trim();
      if (k && v) {
        caracteristicasPayload[k] = v;
      }
    });

    const payload: SaveProductoPayload = {
      ...formData,
      caracteristicas:
        Object.keys(caracteristicasPayload).length > 0 ? caracteristicasPayload : undefined,
    };

    setIsSaving(true);
    try {
      let saved: Producto;

      if (editingProduct) {
        saved = await updateProducto(editingProduct.id, payload);
        setProductos((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      } else {
        saved = await createProducto(payload);
        setProductos((prev) => [saved, ...prev]);
      }

      // Actualizar estado de edición y características con lo que devuelve el backend
      setEditingProduct(saved);

      if (saved.caracteristicas) {
        const rows: CaracteristicaRow[] = Object.entries(saved.caracteristicas).map(
          ([key, value]) => ({ key, value })
        );
        setCaracteristicas(rows);
      } else {
        setCaracteristicas([]);
      }

      alert('Producto guardado correctamente');
    } catch (e) {
      console.error(e);
      alert('Error al guardar el producto');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Link
              to="/catalogo"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver al Catálogo
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">Administración de Productos</span>
          </div>

          <button
            onClick={handleNewProduct}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre del producto"
                  />
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio (solo número, ej. 35.00)
                  </label>
                  <input
                    type="text"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="35.00"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock (cantidad disponible)
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock ?? ''}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min={0}
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Focos LED, Lámparas, Tiras LED, etc."
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Descripción del producto..."
                  />
                </div>

                {/* Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                  <div className="flex items-center space-x-3">
                    <label className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      <span>{isUploadingImage ? 'Subiendo...' : 'Seleccionar archivo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                    {formData.imagen && (
                      <span className="text-xs text-gray-500 truncate max-w-[140px]">
                        {formData.imagen}
                      </span>
                    )}
                  </div>
                  {formData.imagen && (
                    <div className="mt-3">
                      <img
                        src={
                          formData.imagen.startsWith('http')
                            ? formData.imagen
                            : `http://localhost:8080${formData.imagen}`
                        }
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {/* Características técnicas */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Características técnicas
                    </label>
                    <button
                      type="button"
                      onClick={handleAddCaracteristica}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Agregar
                    </button>
                  </div>

                  {caracteristicas.length === 0 && (
                    <p className="text-xs text-gray-400">
                      Aún no has agregado características. Ejemplo: potencia, temperatura_color,
                      vida_útil.
                    </p>
                  )}

                  <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                    {caracteristicas.map((row, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Nombre (ej. potencia)"
                          value={row.key}
                          onChange={(e) => handleCaracteristicaChange(index, 'key', e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Valor (ej. 12W)"
                          value={row.value}
                          onChange={(e) =>
                            handleCaracteristicaChange(index, 'value', e.target.value)
                          }
                          className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCaracteristica(index)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón Guardar */}
                <button
                  type="submit"
                  disabled={isSaving || isUploadingImage}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-white ${
                    isSaving || isUploadingImage
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Save className="h-4 w-4" />
                  <span>
                    {isSaving
                      ? 'Guardando...'
                      : editingProduct
                        ? 'Actualizar Producto'
                        : 'Crear Producto'}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Productos actuales</h2>

              {isLoading ? (
                <p className="text-gray-500">Cargando productos...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : productos.length === 0 ? (
                <p className="text-gray-500">No hay productos registrados.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left">Imagen</th>
                        <th className="px-3 py-2 text-left">Nombre</th>
                        <th className="px-3 py-2 text-left">Categoría</th>
                        <th className="px-3 py-2 text-left">Precio</th>
                        <th className="px-3 py-2 text-left">Stock</th>
                        <th className="px-3 py-2 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((p) => (
                        <tr key={p.id} className="border-t">
                          <td className="px-3 py-2">
                            <img
                              src={
                                p.imagen.startsWith('http')
                                  ? p.imagen
                                  : `http://localhost:8080${p.imagen}`
                              }
                              alt={p.nombre}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <div className="font-medium text-gray-800">{p.nombre}</div>
                            <div className="text-xs text-gray-500">ID: {p.id}</div>
                          </td>
                          <td className="px-3 py-2">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {p.categoria}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            {formatPriceWithSymbol(p.precio)}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`text-xs font-semibold ${
                                p.stock === 0
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {p.stock ?? 0}{' '}
                              {p.stock === 1 ? 'unidad' : 'unidades'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button
                              onClick={() => handleEditProduct(p)}
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-2"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="inline-flex items-center text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;