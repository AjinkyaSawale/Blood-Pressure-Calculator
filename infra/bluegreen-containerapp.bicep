// infra/bluegreen-containerapp.bicep

@description('Location for all resources')
param location string = 'eastus'

@description('Name of the resource group (only used for tagging)')
param resourceGroupName string

@description('Log Analytics workspace name')
param logAnalyticsName string = 'bp-logs'

@description('Container Apps environment name')
param envName string = 'bp-container-env'

@description('Base name for the Container App')
param containerAppName string = 'bp-calculator-app'

@description('Container image to deploy (e.g. ghcr.io/ajinkyasawale/bp-calculator:latest)')
param containerImage string

@description('CPU cores for the container')
@minValue(0.25)
@maxValue(2)
param cpu double = 0.25

@description('Memory for the container')
param memory string = '0.5Gi'

@description('Minimum replica count')
param minReplicas int = 1

@description('Maximum replica count')
param maxReplicas int = 2

// ─────────────────────────────────────────────
// Log Analytics (for Container Apps diagnostics)
// ─────────────────────────────────────────────
resource workspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    retentionInDays: 30
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// ─────────────────────────────────────────────
// Container Apps Environment
// ─────────────────────────────────────────────
resource env 'Microsoft.App/managedEnvironments@2022-03-01' = {
  name: envName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: workspace.properties.customerId
        sharedKey: listKeys(workspace.id, '2020-08-01').primarySharedKey
      }
    }
  }
}

// ─────────────────────────────────────────────
// Container App with blue–green via revisions
// ─────────────────────────────────────────────
resource app 'Microsoft.App/containerApps@2022-03-01' = {
  name: containerAppName
  location: location
  properties: {
    managedEnvironmentId: env.id

    // IMPORTANT: Multiple revisions == blue/green capability
    configuration: {
      activeRevisionsMode: 'Multiple'
      ingress: {
        external: true
        targetPort: 80
        transport: 'auto'
        traffic: [
          // Start simple: 100% to latest revision.
          // To do blue–green, you’ll redeploy with an updated traffic block.
          {
            latestRevision: true
            weight: 100
          }
        ]
      }
    }

    template: {
      containers: [
        {
          name: 'bp-calculator'
          image: containerImage
          resources: {
            cpu: cpu
            memory: memory
          }
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
      }
    }
  }
}

// Helpful outputs for report & pipeline logs
output containerAppNameOut string = app.name
output environmentNameOut string = env.name
