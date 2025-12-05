import { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert'
import { Progress } from '../components/ui/progress'
import {
    TrendingUp,
    Upload,
    RefreshCw,
    Database,
    Activity,
    BarChart3,
    Sparkles,
    FileText,
    Download,
    Brain,
    Cpu,
    Zap,
    Info,
    CheckCircle2,
    Layers
} from 'lucide-react'
import { getDataAvailable, makePrediction, uploadFile, updateCoin } from '../services/api'

export default function MainPage() {
    const [activeTab, setActiveTab] = useState('predict')
    const [dataFiles, setDataFiles] = useState([])
    const [selectedFile, setSelectedFile] = useState('')
    const [predictionDays, setPredictionDays] = useState(30)
    const [windowSize, setWindowSize] = useState(60)
    const [predictionResult, setPredictionResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(false)
    const [coinName, setCoinName] = useState('')
    const [coinPart, setCoinPart] = useState('')

    // Load available data files on mount
    useEffect(() => {
        loadDataFiles()
    }, [])

    const loadDataFiles = async () => {
        try {
            setLoading(true)
            const response = await getDataAvailable()
            setDataFiles(response.files || [])
            if (response.files && response.files.length > 0) {
                setSelectedFile(response.files[0])
            }
        } catch (error) {
            console.error('Error loading data files:', error)
        } finally {
            setLoading(false)
        }
    }

    const handlePredict = async () => {
        if (!selectedFile) {
            alert('Por favor, selecione um arquivo de dados')
            return
        }

        try {
            setLoading(true)
            const result = await makePrediction(selectedFile, predictionDays, windowSize, 'lstm')
            console.log('Prediction API Response:', result)
            console.log('Prediction Result:', result.result)
            setPredictionResult(result.result)
        } catch (error) {
            console.error('Error making prediction:', error)

            let errorMessage = 'Erro ao fazer predição'

            if (error.response?.data?.error) {
                errorMessage = error.response.data.error
            } else if (error.response?.status === 500) {
                errorMessage = 'Erro no servidor. Verifique se o arquivo CSV tem dados suficientes (mínimo 100 linhas recomendado) e está no formato correto com colunas "timestamp" e "price".'
            } else if (error.message) {
                errorMessage = error.message
            }

            alert(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        try {
            setUploadProgress(true)
            const result = await uploadFile(file)
            alert('Arquivo enviado com sucesso: ' + result.filename)
            await loadDataFiles()
        } catch (error) {
            console.error('Error uploading file:', error)
            alert('Erro ao enviar arquivo: ' + error.message)
        } finally {
            setUploadProgress(false)
        }
    }

    const handleUpdateCoin = async () => {
        if (!coinName || !coinPart) {
            alert('Por favor, preencha o nome e a parte da moeda')
            return
        }

        try {
            setLoading(true)
            await updateCoin(coinName, coinPart)
            alert('Dados da moeda atualizados com sucesso!')
            await loadDataFiles()
        } catch (error) {
            console.error('Error updating coin:', error)
            alert('Erro ao atualizar moeda: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    // Process chart data from API predictions
    const chartData = predictionResult && Array.isArray(predictionResult) ?
        predictionResult.map(item => ({
            date: item.Date,
            price: parseFloat(item.PredictedPrice)
        })) :
        Array.from({ length: 30 }, (_, i) => ({
            date: `Day ${i + 1}`,
            price: Math.random() * 1000 + 40000
        }))

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    PriceCast
                                </h1>
                                <p className="text-xs text-muted-foreground font-sans">Cryptocurrency Price Prediction</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="gap-2">
                                <Activity className="w-3 h-3" />
                                API Connected
                            </Badge>
                            <Button variant="outline" size="sm" onClick={loadDataFiles}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                            <CardDescription className="flex items-center gap-2">
                                <Database className="w-4 h-4" />
                                Arquivos Disponíveis
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">{dataFiles.length}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                            <CardDescription className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Dias de Predição
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{predictionDays}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                            <CardDescription className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Modelo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">LSTM</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                            <CardDescription className="flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Window Size
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">{windowSize}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs Section */}
                <Tabs className="space-y-6">
                    <TabsList className="bg-muted border border-border">
                        <TabsTrigger
                            active={activeTab === 'predict'}
                            onClick={() => setActiveTab('predict')}
                        >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Predição
                        </TabsTrigger>
                        <TabsTrigger
                            active={activeTab === 'upload'}
                            onClick={() => setActiveTab('upload')}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                        </TabsTrigger>
                        <TabsTrigger
                            active={activeTab === 'update'}
                            onClick={() => setActiveTab('update')}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Atualizar
                        </TabsTrigger>
                        <TabsTrigger
                            active={activeTab === 'data'}
                            onClick={() => setActiveTab('data')}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Dados
                        </TabsTrigger>
                    </TabsList>

                    {/* Prediction Tab */}
                    {activeTab === 'predict' && (
                        <TabsContent>
                            {/* Configuration Panel - Full Width on Top */}
                            <Card className="bg-card border-border mb-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        Configuração de Predição
                                    </CardTitle>
                                    <CardDescription>
                                        Configure os parâmetros para a predição LSTM
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Arquivo de Dados</label>
                                            <Select
                                                value={selectedFile}
                                                onChange={(e) => setSelectedFile(e.target.value)}
                                            >
                                                {dataFiles.map((file, index) => (
                                                    <option key={index} value={file}>
                                                        {file.split('/').pop()}
                                                    </option>
                                                ))}
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Dias para Prever</label>
                                            <Input
                                                type="number"
                                                value={predictionDays}
                                                onChange={(e) => setPredictionDays(parseInt(e.target.value))}
                                                min="1"
                                                max="365"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Window Size</label>
                                            <Input
                                                type="number"
                                                value={windowSize}
                                                onChange={(e) => setWindowSize(parseInt(e.target.value))}
                                                min="1"
                                                max="365"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium opacity-0">Action</label>
                                            <Button
                                                className="w-full bg-primary hover:bg-primary/90"
                                                onClick={handlePredict}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                        Processando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <TrendingUp className="w-4 h-4 mr-2" />
                                                        Fazer Predição
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Main Content Grid: Chart + ML Info */}
                            <div className="grid lg:grid-cols-5 gap-6">
                                {/* Chart Panel - 3 columns */}
                                <Card className="lg:col-span-3 bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-primary" />
                                            Gráfico de Predição
                                        </CardTitle>
                                        <CardDescription>
                                            Visualização das predições de preço
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                <XAxis
                                                    dataKey="date"
                                                    stroke="#94a3b8"
                                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                    tickFormatter={(value) => {
                                                        if (!value) return ''
                                                        try {
                                                            // Format date to show only day/month
                                                            const date = new Date(value)
                                                            if (isNaN(date.getTime())) return value
                                                            return `${date.getDate()}/${date.getMonth() + 1}`
                                                        } catch {
                                                            return value
                                                        }
                                                    }}
                                                />
                                                <YAxis
                                                    stroke="#94a3b8"
                                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                                    tickFormatter={(value) => {
                                                        if (value === null || value === undefined || isNaN(value)) return ''
                                                        return `$${Number(value).toFixed(2)}`
                                                    }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1e293b',
                                                        border: '1px solid #334155',
                                                        borderRadius: '8px',
                                                        padding: '12px'
                                                    }}
                                                    labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                                                    formatter={(value) => {
                                                        if (value === null || value === undefined || isNaN(value)) return ['N/A', 'Preço Previsto']
                                                        return [`$${parseFloat(value).toFixed(2)}`, 'Preço Previsto']
                                                    }}
                                                    labelFormatter={(label) => `Data: ${label}`}
                                                />
                                                <Legend
                                                    wrapperStyle={{ paddingTop: '20px' }}
                                                    formatter={() => 'Preço Previsto (USD)'}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="price"
                                                    stroke="#3b82f6"
                                                    strokeWidth={2}
                                                    fillOpacity={1}
                                                    fill="url(#colorPrice)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>

                                        {/* Prediction Statistics */}
                                        {predictionResult && Array.isArray(predictionResult) && predictionResult.length > 0 && (() => {
                                            const firstPrice = parseFloat(predictionResult[0]?.PredictedPrice)
                                            const lastPrice = parseFloat(predictionResult[predictionResult.length - 1]?.PredictedPrice)
                                            const variation = ((lastPrice - firstPrice) / firstPrice) * 100
                                            const isValid = !isNaN(firstPrice) && !isNaN(lastPrice) && !isNaN(variation)

                                            if (!isValid) return null

                                            return (
                                                <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700">
                                                    <div className="text-center">
                                                        <p className="text-xs text-muted-foreground mb-1">Preço Inicial</p>
                                                        <p className="text-lg font-bold text-green-400">
                                                            ${firstPrice.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-muted-foreground mb-1">Preço Final</p>
                                                        <p className="text-lg font-bold text-blue-400">
                                                            ${lastPrice.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-muted-foreground mb-1">Variação</p>
                                                        <p className={`text-lg font-bold ${variation > 0 ? 'text-green-400' : 'text-red-400'
                                                            }`}>
                                                            {variation > 0 ? '+' : ''}{variation.toFixed(2)}%
                                                        </p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-muted-foreground mb-1">Tendência</p>
                                                        <p className="text-lg font-bold">
                                                            {variation > 0 ? '📈 Alta' : '📉 Baixa'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })()}
                                    </CardContent>
                                </Card>

                                {/* ML Info Panel - 2 columns */}
                                <div className="lg:col-span-2 space-y-4">
                                    {/* Training Status */}
                                    {loading && (
                                        <Alert variant="info">
                                            <Cpu className="h-4 w-4" />
                                            <AlertTitle>Treinamento em Andamento</AlertTitle>
                                            <AlertDescription>
                                                <div className="space-y-3 mt-3">
                                                    <div>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span>Processando dados...</span>
                                                            <span className="font-mono">~30s</span>
                                                        </div>
                                                        <Progress value={loading ? 45 : 0} className="h-2" />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        O modelo LSTM está sendo treinado com seus dados.
                                                    </p>
                                                </div>
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Success Message */}
                                    {predictionResult && predictionResult.length > 0 && (
                                        <Alert variant="success">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <AlertTitle>Predição Concluída!</AlertTitle>
                                            <AlertDescription>
                                                {predictionResult.length} predições geradas com sucesso.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Model Architecture */}
                                    <Card className="bg-card border-border">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Layers className="w-4 h-4 text-primary" />
                                                Arquitetura LSTM
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 font-mono text-xs">
                                                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                    <span>Input: {windowSize} timesteps</span>
                                                </div>
                                                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                    <span>LSTM 1: 50 units</span>
                                                </div>
                                                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                    <span>LSTM 2: 50 units</span>
                                                </div>
                                                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                    <span>Dense: 25 units</span>
                                                </div>
                                                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                    <span>Output: 1 (price)</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Training Parameters */}
                                    <Card className="bg-card border-border">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-primary" />
                                                Parâmetros
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="p-2 bg-muted rounded">
                                                    <p className="text-[10px] text-muted-foreground mb-0.5">Épocas</p>
                                                    <p className="font-bold font-mono">50</p>
                                                </div>
                                                <div className="p-2 bg-muted rounded">
                                                    <p className="text-[10px] text-muted-foreground mb-0.5">Batch</p>
                                                    <p className="font-bold font-mono">32</p>
                                                </div>
                                                <div className="p-2 bg-muted rounded">
                                                    <p className="text-[10px] text-muted-foreground mb-0.5">LR</p>
                                                    <p className="font-bold font-mono">0.001</p>
                                                </div>
                                                <div className="p-2 bg-muted rounded">
                                                    <p className="text-[10px] text-muted-foreground mb-0.5">Optimizer</p>
                                                    <p className="font-bold font-mono">Adam</p>
                                                </div>
                                                <div className="p-2 bg-muted rounded">
                                                    <p className="text-[10px] text-muted-foreground mb-0.5">Loss</p>
                                                    <p className="font-bold font-mono">MSE</p>
                                                </div>
                                                <div className="p-2 bg-muted rounded">
                                                    <p className="text-[10px] text-muted-foreground mb-0.5">Dropout</p>
                                                    <p className="font-bold font-mono">0.2</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Training Process */}
                                    <Card className="bg-card border-border">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Brain className="w-4 h-4 text-primary" />
                                                Processo
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3 text-xs">
                                                <div className="flex gap-2">
                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                                                        1
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold mb-0.5">Preparação</p>
                                                        <p className="text-muted-foreground text-[10px]">
                                                            Normalização e sequências de {windowSize} dias
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                                                        2
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold mb-0.5">Treinamento</p>
                                                        <p className="text-muted-foreground text-[10px]">
                                                            50 épocas ajustando pesos
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                                                        3
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold mb-0.5">Predição</p>
                                                        <p className="text-muted-foreground text-[10px]">
                                                            {predictionDays} dias futuros
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>
                    )}

                    {/* Upload Tab */}
                    {activeTab === 'upload' && (
                        <TabsContent>
                            <Card className="bg-card border-border max-w-2xl mx-auto">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Upload className="w-5 h-5 text-green-400" />
                                        Upload de Arquivo CSV
                                    </CardTitle>
                                    <CardDescription>
                                        Faça upload de novos arquivos de dados para análise
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
                                        <Upload className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Arraste e solte um arquivo CSV aqui ou clique para selecionar
                                        </p>
                                        <Input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileUpload}
                                            className="max-w-xs mx-auto"
                                            disabled={uploadProgress}
                                        />
                                    </div>
                                    {uploadProgress && (
                                        <div className="flex items-center justify-center gap-2 text-blue-400">
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Enviando arquivo...
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}

                    {/* Update Tab */}
                    {activeTab === 'update' && (
                        <TabsContent>
                            <Card className="bg-card border-border max-w-2xl mx-auto">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <RefreshCw className="w-5 h-5 text-orange-400" />
                                        Atualizar Dados de Moeda
                                    </CardTitle>
                                    <CardDescription>
                                        Atualize os dados de uma criptomoeda específica
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nome da Moeda</label>
                                        <Input
                                            placeholder="Ex: bitcoin, ethereum"
                                            value={coinName}
                                            onChange={(e) => setCoinName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Parte/Período</label>
                                        <Input
                                            placeholder="Ex: 2024, recent, all"
                                            value={coinPart}
                                            onChange={(e) => setCoinPart(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                                        onClick={handleUpdateCoin}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                Atualizando...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4 mr-2" />
                                                Atualizar Dados
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}

                    {/* Data Tab */}
                    {activeTab === 'data' && (
                        <TabsContent>
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-cyan-400" />
                                        Arquivos de Dados Disponíveis
                                    </CardTitle>
                                    <CardDescription>
                                        Lista de todos os arquivos CSV disponíveis para análise
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
                                        </div>
                                    ) : dataFiles.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>Nenhum arquivo de dados encontrado</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {dataFiles.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-cyan-400" />
                                                        <div>
                                                            <p className="font-medium">{file.split('/').pop()}</p>
                                                            <p className="text-xs text-muted-foreground">{file}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedFile(file)}
                                                    >
                                                        Selecionar
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}
                </Tabs>
            </main>
        </div>
    )
}
