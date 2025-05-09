import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth_GET, fetchWithAuth_PUT, fetchWithAuth_POST } from "@/utils/api";
import { UpdateCompany } from "@/backend/interfaces/PUT/update_company";
import { UpdateBulkCompany } from "@/backend/interfaces/PUT/update_bulk_company";


export interface CreateCompany {
  name: string;
  size: number;
  url: string;
  description: string;
}

export interface BulkCreateResponse {
  success: boolean;
  message: string;
  createdCount: number;
}


export interface Company {
  id: string;
  name: string;
  description: string | null;
  size: number | null;
  url: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface CompanyUpdatePayload {
  companyId: string;
  data: Partial<UpdateCompany>;
}

export interface BulkUpdateResponse {
  success: boolean;
  message: string;
  updatedCount: number;
}

export interface CompanyState {
  allCompanies: Company[];
  filteredCompanies: Company[];
  selectedCompany: Company | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCompanies: number;
  };
  filters: {
    sizeRange: {
      lower: number | null;
      upper: number | null;
    };
    searchTerm: string;
  };
  isLoading: boolean;
  error: string | null;
  updateStatus: {
    isUpdating: boolean;
    success: boolean;
    message: string | null;
  };
}


interface GetAllCompaniesResponse {
  [index: number]: Company;
  length: number;
}

interface GetCompanyByIdResponse extends Company {}

interface GetCompanyByNameResponse extends Company {}

interface GetCompaniesPaginatedResponse {
  result: {
    companies: Company[];
    totalCompanies: number;
    totalPages: number;
    currentPage: number;
  };
}

interface GetCompaniesBySizeResponse {
  total: number;
  companies: Company[];
}

interface GetCompaniesBySizePaginatedResponse {
  currentPage: number;
  totalPages: number;
  totalCompanies: number;
  companies: Company[];
}


export const companyInitialState: CompanyState = {
  allCompanies: [],
  filteredCompanies: [],
  selectedCompany: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCompanies: 0,
  },
  filters: {
    sizeRange: {
      lower: null,
      upper: null,
    },
    searchTerm: "",
  },
  isLoading: false,
  error: null,
  updateStatus: {
    isUpdating: false,
    success: false,
    message: null,
  },
};


const getBaseUrl = () => "/api/v1";


export const fetchAllCompanies = createAsyncThunk(
  "master/fetchAllCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetAllCompaniesResponse>(
        `${baseUrl}/companies`
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return rejectWithValue("Failed to fetch all companies");
    }
  }
);

export const fetchCompanyById = createAsyncThunk(
  "master/fetchCompanyById",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetCompanyByIdResponse>(
        `${baseUrl}/companies/${companyId}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(`Failed to fetch company with ID: ${companyId}`);
    }
  }
);

export const fetchCompanyByName = createAsyncThunk(
  "master/fetchCompanyByName",
  async (companyName: string, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetCompanyByNameResponse>(
        `${baseUrl}/companies/name/${encodeURIComponent(companyName)}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(`Failed to fetch company with name: ${companyName}`);
    }
  }
);

export const fetchCompaniesPaginated = createAsyncThunk(
  "master/fetchCompaniesPaginated",
  async (pageNo: number, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetCompaniesPaginatedResponse>(
        `${baseUrl}/companies/page/${pageNo}`
      );
      return response.result;
    } catch (error) {
      return rejectWithValue(`Failed to fetch companies for page: ${pageNo}`);
    }
  }
);

export const fetchCompaniesBySize = createAsyncThunk(
  "master/fetchCompaniesBySize",
  async (
    { lowerLimit, upperLimit }: { lowerLimit: number; upperLimit: number },
    { rejectWithValue }
  ) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetCompaniesBySizeResponse>(
        `${baseUrl}/companies/size/low/${lowerLimit}/high/${upperLimit}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        `Failed to fetch companies with size between ${lowerLimit} and ${upperLimit}`
      );
    }
  }
);

export const fetchCompaniesBySizePaginated = createAsyncThunk(
  "master/fetchCompaniesBySizePaginated",
  async (
    {
      lowerLimit,
      upperLimit,
      pageNo,
    }: { lowerLimit: number; upperLimit: number; pageNo: number },
    { rejectWithValue }
  ) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_GET<GetCompaniesBySizePaginatedResponse>(
        `${baseUrl}/companies/size/low/${lowerLimit}/high/${upperLimit}/page/${pageNo}`
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        `Failed to fetch companies with size between ${lowerLimit} and ${upperLimit} for page ${pageNo}`
      );
    }
  }
);


export const updateCompany = createAsyncThunk(
  "master/updateCompany",
  async (
    { companyId, data }: CompanyUpdatePayload,
    { rejectWithValue }
  ) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_PUT<Company, Partial<UpdateCompany>>(
        `${baseUrl}/companies/${companyId}`,
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue(`Failed to update company with ID: ${companyId}`);
    }
  }
);


export const bulkUpdateCompanies = createAsyncThunk(
  "master/bulkUpdateCompanies",
  async (updates: UpdateBulkCompany[], { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_PUT<BulkUpdateResponse, UpdateBulkCompany[]>(
        `${baseUrl}/companies/bulk`,
        updates
      );
      return response;
    } catch (error) {
      return rejectWithValue("Failed to perform bulk update of companies");
    }
  }
);




export const createCompany = createAsyncThunk(
  "master/createCompany",
  async (data: CreateCompany, { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_POST<Company, CreateCompany>(
        `${baseUrl}/companies`,
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue("Failed to create company");
    }
  }
);


export const bulkCreateCompanies = createAsyncThunk(
  "master/bulkCreateCompanies",
  async (companies: CreateCompany[], { rejectWithValue }) => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetchWithAuth_POST<BulkCreateResponse, CreateCompany[]>(
        `${baseUrl}/companies/bulk`,
        companies
      );
      return response;
    } catch (error) {
      return rejectWithValue("Failed to perform bulk creation of companies");
    }
  }
);


export const companyMasterReducers = {
  
  filterCompaniesByName: (state: CompanyState, action: { payload: string }) => {
    const searchTerm = action.payload.toLowerCase();
    state.filters.searchTerm = searchTerm;
    
    if (searchTerm) {
      state.filteredCompanies = state.allCompanies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm)
      );
    } else {
      state.filteredCompanies = state.allCompanies;
    }
  },
  
  setCompanySizeFilter: (
    state: CompanyState,
    action: { payload: { lower: number | null; upper: number | null } }
  ) => {
    state.filters.sizeRange = action.payload;
  },
  
  clearCompanyFilters: (state: CompanyState) => {
    state.filters = companyInitialState.filters;
    state.filteredCompanies = state.allCompanies;
  },
  
  resetUpdateStatus: (state: CompanyState) => {
    state.updateStatus = {
      isUpdating: false,
      success: false,
      message: null,
    };
  },
  
  resetCompanyState: () => companyInitialState,

  resetCreateStatus: (state: CompanyState) => {
    state.updateStatus = {
      isUpdating: false,
      success: false,
      message: null,
    };
  },
};