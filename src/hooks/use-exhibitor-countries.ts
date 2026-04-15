import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "src/config-global";

const API_URL = `${BASE_URL}/bts/api/v1`;

export function useExhibitorCountries(productGroupId?: string, country?: string) {
    const [countries, setCountries] = useState<{ name: string }[]>([]);
    const [states, setStates] = useState<{ name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            setLoading(true);
            try {
                const params: any = { };
                if (productGroupId) params.productGroupId = productGroupId;
                if (country) params.country = country;

                const res = await axios.get(`${API_URL}/buyer/exhibitor-country`, {
                    headers: { "Content-Type": "application/json" },
                    params,
                });
                const countriesData: any = res.data?.data?.countries;
                const statesData: any = res.data?.data?.states;
                if (mounted && Array.isArray(countriesData)) {
                    const mapped = countriesData.map((c: any) => ({ name: String(c) }));
                    setCountries(mapped);
                }
                if (mounted && Array.isArray(statesData)) {
                    const mapped = statesData.map((s: any) => ({ name: String(s) }));
                    setStates(mapped);
                }
            } catch (err) {
                if (mounted) setError(err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetch();
        return () => {
            mounted = false;
        };
    }, [productGroupId, country]);

    return { countries, states, loading, error };
}