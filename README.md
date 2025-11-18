# 🚀 Infraestructura Base 

Este proyecto define y despliega la infraestructura necesaria para correr nuestras aplicaciones (**admin-dashboard**, **public-app**, **service**) en AWS usando **CloudFormation** y **GitHub Actions**.

---

## 🏗️ Arquitectura

```text
GitHub Actions → CloudFormation → AWS Infra

Componentes creados:
- VPC (10.0.0.0/16)
- Subnet pública (10.0.1.0/24)
- Internet Gateway + RouteTable
- Security Group (SSH + puertos 3000, 8000)
- EC2 Instance (Amazon Linux 2, Docker + Compose + SSM)
- S3 Bucket (para .env, schema.sql, docker-compose)
- IAM Role (EC2 con permisos de S3, ECR, SSM)
- IAM User (GitHub Actions con permisos de escritura en S3)


## 🏗️ Estructura

    infra/
    templates/
        main.yml            # CloudFormation template principal
    parameters/
        dev.json            # Parámetros para entorno dev
        prod.json           # Parámetros para entorno prod
    workflows/
        deploy-infra.yml   # GitHub Actions workflow para despliegue


📦 Dependencias
AWS CLI (para validación y despliegue)

    GitHub Actions (CI/CD)
    CloudFormation (infraestructura como código)
    jq (parseo de parámetros JSON en workflow)
    Docker + Docker Compose (instalados en EC2 vía UserData)
    Amazon SSM Agent (para ejecución remota)


## 🏗️ Template
Template (infra/templates/main.yml)
Define todos los recursos: VPC, Subnet, SG, EC2, S3, IAM roles.

    EC2 se inicializa con:
    Docker + Compose
    SSM Agent
    Red Docker cloudnet
    Carpeta /home/ec2-user/apps para apps


🚀 Flujo CI/CD
Commit en GitHub → dispara workflow.

Workflow (deploy.yml):
    Selecciona parámetros según branch (dev.json o prod.json).
    Configura credenciales AWS.
    Valida el template CloudFormation.
    Despliega el stack (cloud-dev o cloud-prod).
    Muestra outputs (IP pública, bucket, SG).
    CloudFormation:
    Crea/actualiza recursos en AWS.
    EC2 se inicializa con Docker + Compose listo para apps.
    S3 Bucket:
    Recibe .env, schema.sql, docker-compose desde GitHub Actions.
    EC2 los descarga para levantar apps.


🔒 Seguridad y Escalabilidad
Seguridad:
    SG restringido a puertos necesarios (22, 3000, 8000).
    Bucket S3 con acceso bloqueado público.
    IAM roles con permisos mínimos (S3 read, ECR read, SSM).
    Escalabilidad:
    Infraestructura lista para crecer a múltiples instancias.
    Posible evolución hacia ECS/EKS para orquestación avanzada.
    Uso de parámetros JSON para separar entornos (dev/prod).


## 🏗️ Parametros

    dev.json
        [
        { "ParameterKey": "Environment", "ParameterValue": "dev" },
        { "ParameterKey": "KeyName", "ParameterValue": "challenge-dev-keypair" },
        { "ParameterKey": "InstanceType", "ParameterValue": "t3.micro" },
        { "ParameterKey": "Region", "ParameterValue": "ca-central-1" },
        { "ParameterKey": "ImageId", "ParameterValue": "ami-00ba806e3abc6df8b" },
        { "ParameterKey": "AdminRepo", "ParameterValue": "039612870052.dkr.ecr.ca-central-1.amazonaws.com/admin-dashboard" },
        { "ParameterKey": "PublicRepo", "ParameterValue": "039612870052.dkr.ecr.ca-central-1.amazonaws.com/public-app" },
        { "ParameterKey": "ServiceRepo", "ParameterValue": "039612870052.dkr.ecr.ca-central-1.amazonaws.com/service" },
        { "ParameterKey": "InstanceName", "ParameterValue": "cloud-dev" }
        ]
    
