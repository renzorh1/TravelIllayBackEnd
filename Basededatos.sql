USE [master]
GO
/****** Object:  Database [TravelIllay]    Script Date: 21/11/2024 03:38:08 ******/
CREATE DATABASE [TravelIllay]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'TravelIllay', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\TravelIllay.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'TravelIllay_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\TravelIllay_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [TravelIllay] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [TravelIllay].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [TravelIllay] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [TravelIllay] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [TravelIllay] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [TravelIllay] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [TravelIllay] SET ARITHABORT OFF 
GO
ALTER DATABASE [TravelIllay] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [TravelIllay] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [TravelIllay] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [TravelIllay] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [TravelIllay] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [TravelIllay] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [TravelIllay] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [TravelIllay] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [TravelIllay] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [TravelIllay] SET  DISABLE_BROKER 
GO
ALTER DATABASE [TravelIllay] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [TravelIllay] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [TravelIllay] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [TravelIllay] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [TravelIllay] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [TravelIllay] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [TravelIllay] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [TravelIllay] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [TravelIllay] SET  MULTI_USER 
GO
ALTER DATABASE [TravelIllay] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [TravelIllay] SET DB_CHAINING OFF 
GO
ALTER DATABASE [TravelIllay] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [TravelIllay] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [TravelIllay] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [TravelIllay] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [TravelIllay] SET QUERY_STORE = ON
GO
ALTER DATABASE [TravelIllay] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [TravelIllay]
GO
/****** Object:  Table [dbo].[actividades]    Script Date: 21/11/2024 03:38:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[actividades](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](255) NOT NULL,
	[calificacion] [float] NULL,
	[tipo] [nvarchar](50) NULL,
	[latitud] [float] NULL,
	[longitud] [float] NULL,
	[hora_inicio_preferida] [datetime] NULL,
	[hora_fin_preferida] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[historial_itinerarios]    Script Date: 21/11/2024 03:38:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[historial_itinerarios](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[usuario_id] [bigint] NULL,
	[itinerario_id] [bigint] NULL,
	[fecha_creacion] [datetimeoffset](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[itinerario_actividades]    Script Date: 21/11/2024 03:38:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[itinerario_actividades](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[itinerario_id] [bigint] NULL,
	[actividad_id] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[itinerarios]    Script Date: 21/11/2024 03:38:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[itinerarios](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[usuario_id] [bigint] NULL,
	[nombre] [nvarchar](255) NOT NULL,
	[fecha_creacion] [datetimeoffset](7) NULL,
	[es_activo] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[usuarios]    Script Date: 21/11/2024 03:38:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usuarios](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[nombre] [nvarchar](255) NOT NULL,
	[correo] [nvarchar](255) NOT NULL,
	[contrasena] [nvarchar](255) NOT NULL,
	[numero_celular] [nvarchar](50) NULL,
	[idioma_preferencia] [nvarchar](50) NOT NULL,
	[actividades_favoritas] [nvarchar](max) NULL,
	[hora_inicio_preferida] [time](7) NULL,
	[hora_fin_preferida] [time](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[correo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[historial_itinerarios] ADD  DEFAULT (sysdatetimeoffset()) FOR [fecha_creacion]
GO
ALTER TABLE [dbo].[itinerarios] ADD  DEFAULT (sysdatetimeoffset()) FOR [fecha_creacion]
GO
ALTER TABLE [dbo].[itinerarios] ADD  DEFAULT ((1)) FOR [es_activo]
GO
ALTER TABLE [dbo].[historial_itinerarios]  WITH CHECK ADD FOREIGN KEY([itinerario_id])
REFERENCES [dbo].[itinerarios] ([id])
GO
ALTER TABLE [dbo].[historial_itinerarios]  WITH CHECK ADD FOREIGN KEY([usuario_id])
REFERENCES [dbo].[usuarios] ([id])
GO
ALTER TABLE [dbo].[itinerario_actividades]  WITH CHECK ADD FOREIGN KEY([actividad_id])
REFERENCES [dbo].[actividades] ([id])
GO
ALTER TABLE [dbo].[itinerario_actividades]  WITH CHECK ADD FOREIGN KEY([itinerario_id])
REFERENCES [dbo].[itinerarios] ([id])
GO
ALTER TABLE [dbo].[itinerarios]  WITH CHECK ADD FOREIGN KEY([usuario_id])
REFERENCES [dbo].[usuarios] ([id])
GO
ALTER TABLE [dbo].[actividades]  WITH CHECK ADD  CONSTRAINT [CK__actividade__tipo] CHECK  (([tipo]='library' OR [tipo]='museum' OR [tipo]='park' OR [tipo]='restaurant'))
GO
ALTER TABLE [dbo].[actividades] CHECK CONSTRAINT [CK__actividade__tipo]
GO
ALTER TABLE [dbo].[actividades]  WITH CHECK ADD  CONSTRAINT [CK_tipo] CHECK  (([tipo]='newType2' OR [tipo]='newType1' OR [tipo]='library' OR [tipo]='museum' OR [tipo]='park' OR [tipo]='restaurant'))
GO
ALTER TABLE [dbo].[actividades] CHECK CONSTRAINT [CK_tipo]
GO
ALTER TABLE [dbo].[usuarios]  WITH CHECK ADD CHECK  (([idioma_preferencia]='Inglés' OR [idioma_preferencia]='Español'))
GO
USE [master]
GO
ALTER DATABASE [TravelIllay] SET  READ_WRITE 
GO
