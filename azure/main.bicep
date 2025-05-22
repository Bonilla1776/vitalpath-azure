// azure/main.bicep
param location string = resourceGroup().location
param appName string = 'vitalpath'
@secure()
param postgresPassword string
param postgresAdmin string = 'vitaladmin'

// Add PostgreSQL Flexible Server
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: '${appName}-db-psql'
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    version: '14'
    administratorLogin: postgresAdmin
    administratorLoginPassword: postgresPassword
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

// Add database
resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2022-12-01' = {
  parent: postgresServer
  name: 'flexibleserverdb'
}

// Add firewall rule for Azure services
resource postgresFirewallRule 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2022-12-01' = {
  parent: postgresServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource plan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: '${appName}-plan'
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource backend 'Microsoft.Web/sites@2022-09-01' = {
  name: '${appName}-backend'
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|vitalpathregistry.azurecr.io/vitalpath-backend:latest'
      appSettings: [
        { name: 'WEBSITES_PORT', value: '8000' }
        { name: 'POSTGRES_DB', value: 'flexibleserverdb' }
        { name: 'POSTGRES_USER', value: postgresAdmin }
        { name: 'POSTGRES_PASSWORD', value: postgresPassword }
        { name: 'POSTGRES_HOST', value: postgresServer.properties.fullyQualifiedDomainName }
        { name: 'POSTGRES_PORT', value: '5432' }
        { name: 'DJANGO_SECRET_KEY', value: uniqueString(resourceGroup().id) }
        { name: 'DEBUG', value: 'False' }
        { name: 'ALLOWED_HOSTS', value: '${appName}-backend.azurewebsites.net,vitalpathinnovations.com,app.vitalpathinnovations.com' }
      ]
    }
  }
}

resource frontend 'Microsoft.Web/sites@2022-09-01' = {
  name: '${appName}-frontend'
  location: location
  kind: 'app,linux'
  properties: {
    serverFarmId: plan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|vitalpathregistry.azurecr.io/vitalpath-frontend:latest'
      appSettings: [
        { name: 'WEBSITES_PORT', value: '3000' }
        { name: 'NEXT_PUBLIC_API_URL', value: 'https://${appName}-backend.azurewebsites.net' }
      ]
    }
  }
}

resource acr 'Microsoft.ContainerRegistry/registries@2022-02-01-preview' = {
  name: '${replace(appName, '-', '')}registry'
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

// Output the database connection string for reference
output databaseConnectionString string = 'postgresql://${postgresAdmin}:${postgresPassword}@${postgresServer.properties.fullyQualifiedDomainName}/flexibleserverdb'

