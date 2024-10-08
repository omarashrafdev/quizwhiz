import { Nav } from '@/components/Nav';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className='min-h-screen flex flex-col' >
                <Nav />
                <div className="container flex-1 flex flex-col items-center justify-start">
                    <Outlet />
                </div>
            </div>
        </ThemeProvider>
    );
}