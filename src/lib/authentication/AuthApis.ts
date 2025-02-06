import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const API_KEY = process.env.NEXT_PUBLIC_APP_API_KEY;

// Types
interface RegisterUserDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

// Add new interface for filtering options
interface FilteringOptions {
  sortBy?: string;
  brands?: string;
  discounts?: string;
  rating?: string;
}

// Add interface for Deal
interface Deal {
  id: string;
  last_updated: string;
  // Add other deal properties as needed
}

// Add interface for deals response
interface DealsResponse {
  message: Deal[];
}

export interface FetchDealsParams {
  page: number;
  items?: number;
  sortBy?: string[];
  brands?: string[];
  discounts?: string[];
  rating?: string[];
  vertical?: string | null;
}

// Add interface for latest posts response
interface LatestPostsResponse {
  message: [{
    count_latest: number;
  }];
}

// API endpoints
const authEndpoints = {
  register: "/api/user",
  login: "/api/auth/login",
};

// Query tags for cache management
export const AUTH_TAGS = {
  auth: "auth",
  user: "user",
  deals: "deals",
} as const;

// Register mutation hook
export const useRegisterUser = () => {
  return useMutation({
    mutationKey: [AUTH_TAGS.auth, "register"],
    mutationFn: async (userData: RegisterUserDto) => {
      const { data } = await axios.post<RegisterUserResponse>(
        authEndpoints.register,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );
      return data;
    },
  });
};

// Fetch home deals query hook
export const useHomeDeals = () => {
  return useQuery({
    queryKey: [AUTH_TAGS.deals, "home"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/deals/home`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });
      return data?.message;
    },

  });
};

// Fetch latest posts query hook
export const useLatestPosts = (timestamp: string) => {
  return useQuery({
    queryKey: [AUTH_TAGS.deals, "latestPosts", timestamp],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/deals/latestpost?timestamp=${encodeURIComponent(timestamp)}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY, // Using the existing API_KEY constant
          },
        }
      );
      return data;
    },
  });
};

// Add new function to fetch deals
export const useFetchDeals = () => {
  return useMutation({
    mutationKey: [AUTH_TAGS.deals],
    mutationFn: async ({
      page,
      items = 25,
      sortBy,
      brands,
      discounts,
      rating,
      vertical
    }: FetchDealsParams) => {
      const params = new URLSearchParams({
        items: items.toString(),
        page: page.toString(),
      });

      if (sortBy?.length) params.append('sortBy', sortBy.join(','));
      if (brands?.length) params.append('brand', brands.join(','));
      if (discounts?.length) params.append('discount', discounts.join(','));
      if (rating?.length) params.append('rating', rating.join(','));
      if (vertical) params.append('vertical', vertical);
      
      const { data } = await axios.get<DealsResponse>(`/api/deals?${params}`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });
      return data.message;
    },
  });
};

// Add new function to load latest posts
export const useLoadLatestDeals = () => {
  return useMutation({
    mutationKey: [AUTH_TAGS.deals, "latest"],
    mutationFn: async () => {
      const { data } = await axios.get<DealsResponse>('/api/deals?items=25&page=1', {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });
      return data.message;
    },
  });
};

// Add function to fetch latest posts count
export const useFetchLatestPosts = () => {
  return useMutation({
    mutationKey: [AUTH_TAGS.deals, "latestCount"],
    mutationFn: async (timestamp: string) => {
      const { data } = await axios.get<LatestPostsResponse>(
        `/api/deals/latestpost?timestamp=${encodeURIComponent(timestamp)}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );
      return data.message[0].count_latest || 0;
    },
  });
};

// Usage example in component:
/*
const RegisterComponent = () => {
  const register = useRegisterUser();
  
  const handleRegister = async (formData: RegisterUserDto) => {
    try {
      const user = await register.mutateAsync(formData);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
};
*/
