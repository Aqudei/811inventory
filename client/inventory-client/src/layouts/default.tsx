import { Outlet } from 'react-router'

export default function Layput() {
    return (
        <div className='max-w-3xl mx-auto mt-10'>
            <Outlet />
        </div>
    )
}
