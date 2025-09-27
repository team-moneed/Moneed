import { Metadata, Viewport } from 'next';
// import Script from 'next/script';
import '@/1_app/styles/globals.css';
import ModalProvider from '@/1_app/provider/ModalProvider';
import { SnackbarProvider } from '@/6_shared/ui/Snackbar';
import QueryClientProvider from '@/1_app/provider/QueryClientProvider';
import ReactQueryDevtools from '@/1_app/provider/ReactQueryDevtools';

export const metadata: Metadata = {
    title: 'Moneed',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    interactiveWidget: 'resizes-content',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <body>
                {/* GTM noscript */}
                {/* <noscript>
                    <iframe
                        src={`https://www.googletagmanager.com/ns.html?id=${process.env.GTM_KEY}`}
                        height='0'
                        width='0'
                        style={{ display: 'none', visibility: 'hidden' }}
                    ></iframe>
                </noscript> */}

                <div id='root' className='mx-auto h-screen max-w-512 flex flex-col px-8'>
                    <QueryClientProvider>
                        <ModalProvider>
                            {children}
                            <SnackbarProvider />
                        </ModalProvider>
                        <ReactQueryDevtools />
                    </QueryClientProvider>
                </div>

                {/* GA 설치 */}
                {/* <Script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_ID}`}
                    strategy='afterInteractive'
                />
                <Script id='google-analytics' strategy='afterInteractive'>
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }pm
            gtag('js', new Date());
            gtag('config', '${process.env.GA_ID}');
          `}
                </Script> */}

                {/* GTM 설치 */}
                {/* <Script id='google-tag-manager' strategy='afterInteractive'>
                    {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.GTM_KEY}');
          `}
                </Script> */}

                {/* Microsoft Clarity 설치 */}
                {/* <Script id='microsoft-clarity' strategy='afterInteractive'>
                    {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||[];
              c[a].push({start:new Date().getTime(),event:'initialize'});
              i=l.createElement(r);
              i.async=1;
              i.src='https://www.clarity.ms/tag/'+'${process.env.CLARITY_TRACKING_ID}';
              y=l.getElementsByTagName(r)[0];
              y.parentNode.insertBefore(i,y);
            })(window,document,'clarity','script','${process.env.CLARITY_TRACKING_ID}');
          `}
                </Script> */}
            </body>
        </html>
    );
}
