import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import {useHttp} from '../../hooks/http.hook';

const heroesAdapter = createEntityAdapter()

const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle',
    filteredHeroes: []
})

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    () => {
        const {request} = useHttp()
        return request("http://localhost:3001/heroes")
    }
)

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        filtersApply: (state, action) => {
            state.filteredHeroes = action.payload
        },
        heroesAdd: (state, action) => {
            heroesAdapter.setAll(state, action.payload)

        },
        heroesDelete : (state, action) => {
            heroesAdapter.setAll(state, action.payload)

        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchHeroes.pending, state => {
            state.heroesLoadingStatus = 'loading'
        })
        .addCase(fetchHeroes.fulfilled, (state, action) => {
            state.heroesLoadingStatus = 'idle'
            heroesAdapter.setAll(state, action.payload)
        })
        .addCase(fetchHeroes.rejected, state => {
            state.heroesLoadingStatus = 'error'
        })
        .addDefaultCase(() => {})
    }
})

const {actions, reducer} = heroesSlice

export const {selectAll} = heroesAdapter.getSelectors(state => state.heroes)

export default reducer
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroesAdd,
    heroesDelete,
    filtersApply
} = actions