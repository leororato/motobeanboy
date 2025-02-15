import { Icon } from '@iconify/react';
import { Autocomplete, Box, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';

const AutocompleteEndMapa = ({ setEnderecoDigitado, enderecoDigitado, cidade, numero, removerMarcador, setPosicaoSelecionada }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const fetchAddresses = async (query) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=BR&format=json&addressdetails=1&limit=5`
            );
            console.log("resposta: ", response)

            if (!response.ok) {
                throw new Error('Erro ao buscar endereços');
            }

            const data = await response.json();
            console.log('formattedSuggestions: ', data);

            const formattedSuggestions = data.map((address) => ({
                display_name: `${address?.address?.road || ''}, ${address?.address?.city || address?.address?.town || address?.address?.village || ''}, ${address?.address?.state || ''}, ${address?.address?.country || ''}`,
                place_id: address.place_id,
                latitude: address.lat,
                longitude: address.lon
            }));

            setSuggestions(formattedSuggestions.length > 0 ? formattedSuggestions : []);
            console.log('suggestions: ', suggestions)
        } catch (error) {
            console.error('Erro ao buscar endereços:', error);
            setSuggestions([]);
        }
    };

    useEffect(() => {
        const handleSearch = setTimeout(() => {
            const query = `${encodeURIComponent(inputValue)}+${encodeURIComponent(numero)}+${cidade}+Paraná`;
            if (inputValue.length >= 3) {
                fetchAddresses(query);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(handleSearch);
    }, [inputValue, cidade, numero]);

    const handleSuggestionClick = (address) => {
        if (address.latitude && address.longitude) {
            setInputValue(address.display_name);
            setEnderecoDigitado(address.display_name);
            setSuggestions([]);
            setPosicaoSelecionada({
                lat: parseFloat(address.latitude),
                lng: parseFloat(address.longitude),
            });
        } else {
            console.error('Coordenadas inválidas:', address);
        }
    };


    return (
        <Box>
            <Autocomplete
                options={suggestions}
                getOptionLabel={(option) => option.display_name || ''}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                onChange={(event, newValue) => {
                    if (newValue) {
                        handleSuggestionClick(newValue);
                    }
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Endereço" variant="standard" />
                )}
            />
           
            <Icon
                icon="mdi:reload"
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                }}
                onClick={() => {
                    removerMarcador();
                    setInputValue("")
                }}
            />
            {suggestions.length > 0 && (
                <ul
                    style={{
                        position: 'absolute',
                        zIndex: 1000,
                        margin: '0',
                        padding: '0',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        width: '100%',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        top: '100%',
                        left: '0',
                    }}
                >
                    {suggestions.map((address) => (
                        <li
                            key={address.place_id}
                            onClick={() => handleSuggestionClick(address)}
                            style={{
                                cursor: 'pointer',
                                padding: '10px',
                                borderBottom: '1px solid #eaeaea',
                                backgroundColor: '#f9f9f9',
                                transition: 'background-color 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#e0f7fa';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f9f9f9';
                            }}
                        >
                            {address.display_name}
                        </li>
                    ))}
                </ul>
            )}


        </Box>
    );
};

export default AutocompleteEndMapa;
