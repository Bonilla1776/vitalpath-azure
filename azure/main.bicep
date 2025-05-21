// azure/main.bicep
param location string = resourceGroup().location
param appName string = 'vitalpath'
@secure()
param postgresPassword string
param postgresAdmin string = 'vitaladmin'

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
        { name: 'DATABASE_URL', value: 'postgresql://${postgresAdmin}:${postgresPassword}@${appName}-db-psql.postgres.database.azure.com/flexibleserverdb' }
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

