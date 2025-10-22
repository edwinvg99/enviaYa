# Script de prueba rápida para PowerShell
# Ejecuta desde: .\test-product-flow.ps1

Write-Host "🚀 Iniciando prueba de registro de productos..." -ForegroundColor Cyan
Write-Host ""

# Variables
$baseUrl = "http://localhost:3000/api/v1"
$email = "admin@test.com"
$password = "Admin123456"

# Paso 1: Registrar usuario ADMIN
Write-Host "📝 Paso 1: Registrando usuario ADMIN..." -ForegroundColor Yellow
$registerBody = @{
    name = "Admin Test"
    email = $email
    password = $password
    phone = "+573001234567"
    role = "ADMIN"
    address = @{
        street = "Calle 123"
        city = "Bogotá"
        state = "Cundinamarca"
        postalCode = "110111"
    }
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/users/register" -Method Post -Body $registerBody -ContentType "application/json"
    $userId = $registerResponse.user._id
    Write-Host "✅ Usuario registrado exitosamente!" -ForegroundColor Green
    Write-Host "   User ID: $userId" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error al registrar usuario: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Es posible que el usuario ya exista. Continúa con un ID existente." -ForegroundColor Yellow
    Write-Host ""
    # Para la prueba, usa un ID genérico si falla
    $userId = "67890abcdef123456789"
}

# Paso 2: Crear producto
Write-Host "📦 Paso 2: Creando producto..." -ForegroundColor Yellow
$productBody = @{
    name = "Laptop Dell Test"
    description = "Laptop de prueba con Intel Core i5"
    price = 599.99
    stock = 10
    image = "https://example.com/laptop.jpg"
    isActive = $true
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "x-user-id" = $userId
    "x-user-role" = "ADMIN"
}

try {
    $productResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method Post -Body $productBody -Headers $headers
    Write-Host "✅ Producto creado exitosamente!" -ForegroundColor Green
    Write-Host "   Product ID: $($productResponse.data.data._id)" -ForegroundColor Gray
    Write-Host "   Nombre: $($productResponse.data.data.name)" -ForegroundColor Gray
    Write-Host "   Precio: $($productResponse.data.data.price)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error al crear producto: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Paso 3: Listar productos
Write-Host "📋 Paso 3: Listando productos..." -ForegroundColor Yellow
try {
    $productsResponse = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get
    $productCount = $productsResponse.data.data.Count
    Write-Host "✅ Se encontraron $productCount producto(s)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Error al listar productos: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "🎉 Prueba completada!" -ForegroundColor Cyan
