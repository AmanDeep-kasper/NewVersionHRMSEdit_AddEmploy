import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Pages/config/api";
import Cookies from "js-cookie";

export const fetchShiftTotals = createAsyncThunk(
    "shifts/fetchShiftTotals",
    async (period = 'monthly', { rejectWithValue }) => {
        try {
            const token = Cookies.get('authToken');
            console.log('[fetchShiftTotals thunk] period:', period, 'token exists:', !!token);
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const res = await api.get('/api/shifts/totals', { params: { period }, ...config });
            // normalize into array
            const totals = res.data?.totals || [];
            const byId = {};
            totals.forEach(t => {
                byId[t.shiftId] = t;
            });
            console.log('[fetchShiftTotals thunk resolved] period:', period, 'totals count:', totals.length);
            return { totals, byId, period, meta: res.data?.period || null };
        } catch (err) {
            console.error('[fetchShiftTotals thunk error]', period, err.response?.data || err.message);
            return rejectWithValue(err.response?.data || { message: 'Failed to fetch shift totals' });
        }
    }
);

// Fetch shift totals without any period filter - get all data
export const fetchAllShiftTotals = createAsyncThunk(
    "shifts/fetchAllShiftTotals",
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get('authToken');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            const res = await api.get('/api/shifts/totals', config);
            const totals = res.data?.totals || [];
            const byId = {};
            totals.forEach(t => {
                byId[t.shiftId] = t;
            });
            console.log('[fetchAllShiftTotals thunk resolved] totals count:', totals.length);
            return { totals, byId, period: 'all', meta: res.data?.period || null };
        } catch (err) {
            console.error('[fetchAllShiftTotals thunk error]', err.response?.data || err.message);
            return rejectWithValue(err.response?.data || { message: 'Failed to fetch all shift totals' });
        }
    }
);

const shiftSlice = createSlice({
    name: 'shift',
    initialState: {
        totals: [],
        totalsById: {},
        status: 'idle',
        error: null,
        period: null,
        // Store totals per period separately for independent data
        byPeriod: {
            today: { totals: [], totalsById: {}, status: 'idle' },
            daily: { totals: [], totalsById: {}, status: 'idle' },
            weekly: { totals: [], totalsById: {}, status: 'idle' },
            monthly: { totals: [], totalsById: {}, status: 'idle' },
            yearly: { totals: [], totalsById: {}, status: 'idle' },
        },
        // Unfiltered/all data without period restriction
        allTotals: {
            totals: [],
            totalsById: {},
            status: 'idle',
            error: null
        }
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchShiftTotals.pending, (state, action) => {
                const period = action.meta.arg || 'monthly';
                console.log('[Redux shiftSlice.pending] period:', period);
                state.status = 'loading';
                if (state.byPeriod[period]) {
                    state.byPeriod[period].status = 'loading';
                }
            })
            .addCase(fetchShiftTotals.fulfilled, (state, action) => {
                const period = action.payload.period || 'monthly';
                console.log('[Redux shiftSlice.fulfilled]', { period, totalsCount: action.payload.totals.length, byIdKeys: Object.keys(action.payload.byId) });
                state.status = 'succeeded';
                state.totals = action.payload.totals;
                state.totalsById = action.payload.byId;
                state.period = action.payload.period;
                state.error = null;
                // Also store in period-specific bucket
                if (state.byPeriod[period]) {
                    state.byPeriod[period].totals = action.payload.totals;
                    state.byPeriod[period].totalsById = action.payload.byId;
                    state.byPeriod[period].status = 'succeeded';
                    console.log('[Redux shiftSlice] Stored', period, 'totalsById:', Object.keys(action.payload.byId));
                }
            })
            .addCase(fetchShiftTotals.rejected, (state, action) => {
                const period = action.meta.arg || 'monthly';
                console.error('[Redux shiftSlice.rejected] period:', period, 'error:', action.payload || action.error);
                state.status = 'failed';
                state.error = action.payload || action.error;
                if (state.byPeriod[period]) {
                    state.byPeriod[period].status = 'failed';
                }
            })
            // Handle fetchAllShiftTotals (unfiltered data)
            .addCase(fetchAllShiftTotals.pending, (state) => {
                state.status = 'loading';
                state.allTotals = {
                    totals: [],
                    totalsById: {},
                    status: 'loading',
                    error: null
                };
            })
            .addCase(fetchAllShiftTotals.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allTotals = {
                    totals: action.payload.totals,
                    totalsById: action.payload.byId,
                    status: 'succeeded',
                    error: null
                };
            })
            .addCase(fetchAllShiftTotals.rejected, (state, action) => {
                state.status = 'failed';
                state.allTotals = {
                    totals: [],
                    totalsById: {},
                    status: 'failed',
                    error: action.payload || action.error
                };
            });
    }
});

export default shiftSlice.reducer;
