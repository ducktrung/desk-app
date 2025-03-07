import { HeaderOnly } from '~/components/Layout'


import Home from '~/pages/Home'
import Following from '~/pages/Following'
import Profile from '~/pages/Profile'
import Upload from '~/pages/Upload'
import ProductDetail from '~/pages/ProductDetail'
import AdminPage from '~/pages/Admin'
import UpdateProductPage from '~/pages/UpdateProduct'


const publicRoutes = [
    { path: '/', component: Home },
    { path: '/following', component: Following },
    { path: '/profile', component: Profile },
    { path: '/upload', component: Upload, layout: HeaderOnly},
    { path: '/productdetail/:id', component: ProductDetail},
    { path: '/admin', component: AdminPage},
    { path: '/admin/updateproduct/:id', component: UpdateProductPage},
]

const privateRoutes = [

]

export { publicRoutes, privateRoutes }