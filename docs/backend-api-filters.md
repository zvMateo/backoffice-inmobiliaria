# API de Filtros para el Mapa - Documentación

## Endpoint
```
GET /api/Mapa/GetPropiedadesByFilter
```

## Parámetros de Query (opcionales)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `tipos` | string | Tipos de propiedad separados por coma | `"casa,departamento"` |
| `operaciones` | string | Tipos de operación separados por coma | `"venta,alquiler mensual"` |
| `ciudades` | string | Ciudades separadas por coma | `"Córdoba Capital,Villa del Rosario"` |
| `precioMin` | number | Precio mínimo | `100000` |
| `precioMax` | number | Precio máximo | `500000` |
| `areaMin` | number | Área mínima en m² | `50` |
| `areaMax` | number | Área máxima en m² | `200` |
| `dormitorios` | string | Número de dormitorios separados por coma | `"2,3,4"` |
| `banos` | string | Número de baños separados por coma | `"1,2"` |
| `moneda` | string | Moneda | `"USD"` o `"ARS"` |
| `caracteristicas` | string | Características separadas por coma | `"garage,balcon,piscina"` |

## Ejemplo de Request
```
GET /api/Mapa/GetPropiedadesByFilter?tipos=casa,departamento&operaciones=venta&precioMin=100000&precioMax=500000&moneda=USD
```

## Respuesta Esperada
```json
[
  {
    "id": 1,
    "name": "Casa en Nueva Córdoba",
    "typeproperty": "casa",
    "zone": "Nueva Córdoba",
    "price": 150000,
    "currency": "USD",
    "lat": -31.4201,
    "lng": -64.1888,
    "address": "Av. Colón 1234",
    "description": "Hermosa casa en Nueva Córdoba",
    "area": 120,
    "bedrooms": 3,
    "bathrooms": 2,
    "photos": ["url1.jpg", "url2.jpg"]
  }
]
```

## Mapeo de Filtros Frontend → Backend

| Frontend (PropertyFilters) | Backend (Query Params) |
|----------------------------|------------------------|
| `filters.type` | `tipos` |
| `filters.operation` | `operaciones` |
| `filters.city` | `ciudades` |
| `filters.priceRange.min` | `precioMin` |
| `filters.priceRange.max` | `precioMax` |
| `filters.areaRange.min` | `areaMin` |
| `filters.areaRange.max` | `areaMax` |
| `filters.bedrooms` | `dormitorios` |
| `filters.bathrooms` | `banos` |
| `filters.currency` | `moneda` |
| `filters.features` | `caracteristicas` |

## Campos Requeridos en la Respuesta

| Campo | Tipo | Descripción | Requerido |
|-------|------|-------------|-----------|
| `id` | number | ID único de la propiedad | ✅ |
| `name` | string | Nombre/título de la propiedad | ✅ |
| `typeproperty` | string | Tipo de propiedad | ✅ |
| `zone` | string | Zona/ciudad | ❌ |
| `price` | number | Precio | ✅ |
| `currency` | string | Moneda (USD/ARS) | ✅ |
| `lat` | number | Latitud | ✅ |
| `lng` | number | Longitud | ✅ |
| `address` | string | Dirección | ❌ |
| `description` | string | Descripción | ❌ |
| `area` | number | Área en m² | ❌ |
| `bedrooms` | number | Número de dormitorios | ❌ |
| `bathrooms` | number | Número de baños | ❌ |
| `photos` | string[] | Array de URLs de fotos | ❌ |

## Notas para el Backend C#

1. **Validación**: Todos los parámetros son opcionales
2. **Arrays**: Los arrays se envían como strings separados por coma
3. **Rangos**: Los rangos de precio y área deben incluir ambos extremos (inclusive)
4. **Moneda**: Solo acepta "USD" o "ARS"
5. **Coordenadas**: `lat` y `lng` son obligatorias para mostrar en el mapa
6. **Sin filtros**: Si no se envían filtros, devolver TODAS las propiedades
7. **Respuesta**: Debe devolver un array de objetos `GetPropierties`

## Testing

Para probar la implementación:

1. Abre el mapa en `/mapa-inmobiliaria`
2. Aplica filtros usando el sidebar o filtros móviles
3. Verifica que se haga la llamada al endpoint con los parámetros correctos
4. Revisa la consola del navegador para ver las requests
