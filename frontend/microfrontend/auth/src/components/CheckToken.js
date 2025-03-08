import React from 'react';

import api from "../utils/api";

export const CheckToken = (token) => {
    return api.checkToken(token)
}

export default CheckToken;