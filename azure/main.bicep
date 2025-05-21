// azure/main.bicep
param location string = resourceGroup().location
param appName string = 'vitalpath'
param postgresAdmin string = 'vitaladmin'
param postgresPassword string

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
        { name: 'DATABASE_URL', value: 'postgresql://${postgresAdmin}:${postgresPassword}@${appName}-db.postgres.database.azure.com/flexibleserverdb' }
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
      ]
    }
  }
}

resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2022-01-20-preview' = {
  name: '${appName}-db'
  location: location
  properties: {
    administratorLogin: postgresAdmin
    administratorLoginPassword: postgresPassword
    version: '14'
    storage: {
      storageSizeGB: 32
    }
    authentication: {
      passwordAuthentication: {
        passwordAuthenticationMethod: 'Enabled'
      }
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
    capacity: 1
    family: 'Gen5'
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: '${appName}-vault'
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      name: 'standard'
      family: 'A'
    }
    accessPolicies: []
    enableSoftDelete: true
    enablePurgeProtection: true
  }
}

resource acr 'Microsoft.ContainerRegistry/registries@2022-02-01-preview' = {
  name: '${appName}acr'
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}
