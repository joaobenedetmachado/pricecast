import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Get available data files
export const getDataAvailable = async () => {
    try {
        const response = await api.get('/data-avaiable')
        return response.data
    } catch (error) {
        console.error('Error fetching available data:', error)
        throw error
    }
}

// Make prediction
export const makePrediction = async (csvPath, days, windowSize, model = 'lstm', hyperparams = {}) => {
    try {
        const params = {
            csv_path: csvPath,
            days: days,
            window_size: windowSize,
            model: model,
        }

        // Add optional hyperparameters if provided
        if (hyperparams.epochs !== undefined) params.epochs = hyperparams.epochs
        if (hyperparams.batch_size !== undefined) params.batch_size = hyperparams.batch_size
        if (hyperparams.learning_rate !== undefined) params.learning_rate = hyperparams.learning_rate
        if (hyperparams.optimizer !== undefined) params.optimizer = hyperparams.optimizer
        if (hyperparams.loss !== undefined) params.loss = hyperparams.loss
        if (hyperparams.dropout !== undefined) params.dropout = hyperparams.dropout

        const response = await api.post('/predict', null, { params })
        return response.data
    } catch (error) {
        console.error('Error making prediction:', error)
        throw error
    }
}

// Upload CSV file
export const uploadFile = async (file) => {
    try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    } catch (error) {
        console.error('Error uploading file:', error)
        throw error
    }
}

// Update coin data
export const updateCoin = async (name, part) => {
    try {
        const response = await api.post('/update', null, {
            params: {
                name: name,
                part: part,
            },
        })
        return response.data
    } catch (error) {
        console.error('Error updating coin:', error)
        throw error
    }
}

export default api
