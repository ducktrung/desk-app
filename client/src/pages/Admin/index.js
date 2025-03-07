import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Hero from '~/components/Layout/components/Hero'
import Profile from '~/components/Layout/components/Profile'
import ProductsAdmin from '~/components/Layout/components/ProductsAdmin'

function AdminPage() {
  return (
    <div className="w-6/12 m-auto">
        <Hero />
        <Profile />
        <ProductsAdmin />
    </div>
  )
}

export default AdminPage;
