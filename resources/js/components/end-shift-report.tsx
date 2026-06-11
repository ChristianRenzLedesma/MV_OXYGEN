import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface EndShiftReportProps {
    reportData: {
        cashier_name: string;
        shift_date: string;
        shift_start_time: string;
        shift_end_time: string;
        total_sales: number;
        total_revenue: number;
        cash_sales: number;
        gcash_sales: number;
        card_sales: number;
        unique_customers: number;
        sales: Array<{
            id: number;
            customer_name: string;
            payment_method: string;
            total_amount: number;
            items: Array<{
                tank_type: string;
                quantity: number;
                price: number;
            }>;
            created_at: string;
        }>;
    };
}

const EndShiftReport: React.FC<EndShiftReportProps> = ({ reportData }) => {
    const handlePrint = () => {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow?.document;
        if (!iframeDoc) {
            document.body.removeChild(iframe);
            return;
        }

        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>End Shift Report</title>
                <style>
                    @page {
                        size: 80mm auto !important;
                        margin: 0 !important;
                    }
                    @media print {
                        body {
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 80mm !important;
                            font-family: 'Courier New', monospace;
                            background: white !important;
                        }
                        html {
                            margin: 0 !important;
                            padding: 0 !important;
                            width: 80mm !important;
                        }
                        .report-wrapper {
                            margin: 0 auto !important;
                            padding: 10px !important;
                            max-width: 80mm !important;
                            font-size: 11px !important;
                            line-height: 1.4 !important;
                        }
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: 'Courier New', monospace;
                        background: white;
                    }
                    .report-wrapper {
                        margin: 0 auto;
                        padding: 10px;
                        max-width: 80mm;
                        font-size: 11px;
                        line-height: 1.4;
                    }
                </style>
            </head>
            <body>
                ${generateReportHTML(reportData)}
            </body>
            </html>
        `);
        iframeDoc.close();

        setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 300);
    };

    const generateReportHTML = (data: any) => {
        const formatCurrency = (amount: number) => {
            return new Intl.NumberFormat('en-PH', {
                style: 'currency',
                currency: 'PHP'
            }).format(amount);
        };

        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            const options: Intl.DateTimeFormatOptions = {
                timeZone: 'Asia/Manila',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            return date.toLocaleString('en-PH', options);
        };

        const itemSummary: { [key: string]: { quantity: number; amount: number } } = {};
        data.sales.forEach((sale: any) => {
            sale.items.forEach((item: any) => {
                if (!itemSummary[item.tank_type]) {
                    itemSummary[item.tank_type] = { quantity: 0, amount: 0 };
                }
                itemSummary[item.tank_type].quantity += item.quantity;
                itemSummary[item.tank_type].amount += (item.price * item.quantity);
            });
        });

        return `
            <div class="report-wrapper">
                <div style="text-align: center; margin-bottom: 8px;">
                    <div style="font-size: 16px; font-weight: bold; letter-spacing: 2px;">MV OXYGEN</div>
                    <div style="font-size: 10px;">Gas Cylinder Sales & Services</div>
                    <div style="font-size: 9px; margin-top: 2px;">Contact No: 0977-330-5640</div>
                </div>
                <div style="text-align: center; margin: 8px 0;">***************************************</div>
                <div style="text-align: center; font-size: 13px; font-weight: bold; letter-spacing: 2px; margin: 8px 0;">END SHIFT REPORT</div>
                <div style="text-align: center; margin: 8px 0;">***************************************</div>
                <div style="margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between;"><span>Cashier:</span><span>${data.cashier_name}</span></div>
                    <div style="display: flex; justify-content: space-between;"><span>Shift Start:</span><span>${formatDate(data.shift_start_time)}</span></div>
                    <div style="display: flex; justify-content: space-between;"><span>Shift End:</span><span>${formatDate(data.shift_end_time)}</span></div>
                </div>
                <div style="text-align: center; margin: 8px 0;">----------------------------------------</div>
                <div style="margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between;"><span>Total Sales:</span><span>${data.total_sales}</span></div>
                    <div style="display: flex; justify-content: space-between;"><span>Customers:</span><span>${data.unique_customers}</span></div>
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin-top: 4px;"><span>TOTAL REVENUE:</span><span>${formatCurrency(data.total_revenue)}</span></div>
                </div>
                <div style="text-align: center; margin: 8px 0;">***************************************</div>
                <div style="margin-bottom: 8px;">
                    <div style="text-align: center; font-size: 10px; font-weight: bold; margin-bottom: 4px;">PAYMENT BREAKDOWN</div>
                    <div style="display: flex; justify-content: space-between;"><span>Cash Sales:</span><span>${formatCurrency(data.cash_sales)}</span></div>
                    <div style="display: flex; justify-content: space-between;"><span>GCash Sales:</span><span>${formatCurrency(data.gcash_sales)}</span></div>
                    <div style="display: flex; justify-content: space-between;"><span>Card Sales:</span><span>${formatCurrency(data.card_sales)}</span></div>
                </div>
                <div style="text-align: center; margin: 8px 0;">----------------------------------------</div>
                <div style="text-align: center; font-size: 10px; font-weight: bold; margin-bottom: 4px;">TRANSACTIONS (${data.sales.length})</div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 5px; font-size: 9px;"><span style="flex: 1;">#</span><span style="flex: 2;">Customer</span><span style="flex: 1; text-align: right;">Amount</span></div>
                <div style="text-align: center; margin: 5px 0;">----------------------------------------</div>
                <div style="margin-bottom: 8px;">
                    ${data.sales.slice(0, 10).map((sale: any) => `
                        <div style="margin-bottom: 4px;">
                            <div style="display: flex; justify-content: space-between; font-size: 9px;">
                                <span style="flex: 1;">#${sale.id}</span>
                                <span style="flex: 2;">${sale.customer_name.length > 12 ? sale.customer_name.substring(0, 12) + '...' : sale.customer_name}</span>
                                <span style="flex: 1; text-align: right;">${formatCurrency(sale.total_amount)}</span>
                            </div>
                            <div style="font-size: 8px; color: #666; margin-left: 20px;">${sale.payment_method.toUpperCase()} • ${new Date(sale.created_at).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    `).join('')}
                    ${data.sales.length > 10 ? `<div style="text-align: center; font-size: 9px; font-style: italic; margin-top: 4px;">... and ${data.sales.length - 10} more</div>` : ''}
                </div>
                <div style="text-align: center; margin: 8px 0;">----------------------------------------</div>
                <div style="text-align: center; font-size: 10px; font-weight: bold; margin-bottom: 4px;">ITEMS SOLD SUMMARY</div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 5px; font-size: 9px;"><span style="flex: 2;">Item</span><span style="flex: 1; text-align: right;">Qty</span><span style="flex: 1; text-align: right;">Total</span></div>
                <div style="text-align: center; margin: 5px 0;">----------------------------------------</div>
                <div style="margin-bottom: 8px;">
                    ${Object.entries(itemSummary).map(([tankType, summary]: [string, any]) => `
                        <div style="margin-bottom: 4px;">
                            <div style="display: flex; justify-content: space-between; font-size: 9px;">
                                <span style="flex: 2;">${tankType.length > 15 ? tankType.substring(0, 15) + '...' : tankType}</span>
                                <span style="flex: 1; text-align: right;">${summary.quantity}</span>
                                <span style="flex: 1; text-align: right;">${formatCurrency(summary.amount)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="text-align: center; margin: 8px 0;">***************************************</div>
                <div style="text-align: center; margin-top: 10px;">
                    <div style="font-size: 14px; font-weight: bold; letter-spacing: 2px; margin-bottom: 5px;">SHIFT COMPLETE</div>
                    <div style="font-size: 9px;">Thank you for your service</div>
                    <div style="font-size: 8px; margin-top: 8px; color: #666;">This is an official end of shift report<br />Keep for business records</div>
                </div>
                <div style="margin-top: 15px;">
                    <div style="margin-bottom: 10px;">
                        <div style="font-size: 9px; margin-bottom: 3px;">Cashier Signature:</div>
                        <div style="border-bottom: 1px solid black; height: 20px;"></div>
                    </div>
                    <div>
                        <div style="font-size: 9px; margin-bottom: 3px;">Manager Signature:</div>
                        <div style="border-bottom: 1px solid black; height: 20px;"></div>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 10px; font-family: monospace; font-size: 14px; letter-spacing: 2px;">||| || ||| || |||| ||| || |||</div>
                <div style="text-align: center; font-size: 9px; margin-top: 2px;">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            </div>
        `;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        // Use Manila timezone (Asia/Manila)
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Manila',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-PH', options);
    };

    // Calculate item summary
    const itemSummary: { [key: string]: { quantity: number; amount: number } } = {};
    reportData.sales.forEach(sale => {
        sale.items.forEach(item => {
            if (!itemSummary[item.tank_type]) {
                itemSummary[item.tank_type] = { quantity: 0, amount: 0 };
            }
            itemSummary[item.tank_type].quantity += item.quantity;
            itemSummary[item.tank_type].amount += (item.price * item.quantity);
        });
    });

    return (
        <div>
            <div style={{ marginBottom: '16px' }}>
                <Button onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Report
                </Button>
            </div>
            <div style={{ fontFamily: "'Courier New', monospace", padding: '10px', maxWidth: '320px', margin: '0 auto', fontSize: '11px', lineHeight: '1.4', width: '80mm' }}>
            {/* Shop Header */}
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px' }}>MV OXYGEN</div>
                <div style={{ fontSize: '10px' }}>Gas Cylinder Sales & Services</div>
                <div style={{ fontSize: '9px', marginTop: '2px' }}>Contact No: 0977-330-5640</div>
            </div>

            <div style={{ textAlign: 'center', margin: '8px 0' }}>***************************************</div>

            {/* END SHIFT REPORT Title */}
            <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 'bold', letterSpacing: '2px', margin: '8px 0' }}>
                END SHIFT REPORT
            </div>

            <div style={{ textAlign: 'center', margin: '8px 0' }}>***************************************</div>

            {/* Shift Info */}
            <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cashier:</span>
                    <span>{reportData.cashier_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shift Start:</span>
                    <span>{formatDate(reportData.shift_start_time)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shift End:</span>
                    <span>{formatDate(reportData.shift_end_time)}</span>
                </div>
            </div>

            <div style={{ textAlign: 'center', margin: '8px 0' }}>----------------------------------------</div>

            {/* Summary */}
            <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Sales:</span>
                    <span>{reportData.total_sales}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Customers:</span>
                    <span>{reportData.unique_customers}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12px', marginTop: '4px' }}>
                    <span>TOTAL REVENUE:</span>
                    <span>{formatCurrency(reportData.total_revenue)}</span>
                </div>
            </div>

            <div style={{ textAlign: 'center', margin: '8px 0' }}>***************************************</div>

            {/* Payment Breakdown */}
            <div style={{ marginBottom: '8px' }}>
                <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>
                    PAYMENT BREAKDOWN
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cash Sales:</span>
                    <span>{formatCurrency(reportData.cash_sales)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GCash Sales:</span>
                    <span>{formatCurrency(reportData.gcash_sales)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Card Sales:</span>
                    <span>{formatCurrency(reportData.card_sales)}</span>
                </div>
            </div>

            <div style={{ textAlign: 'center', margin: '8px 0' }}>----------------------------------------</div>

            {/* Transaction List Header */}
            <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>
                TRANSACTIONS ({reportData.sales.length})
            </div>

            {/* Column Headers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px', fontSize: '9px' }}>
                <span style={{ flex: '1' }}>#</span>
                <span style={{ flex: '2' }}>Customer</span>
                <span style={{ flex: '1', textAlign: 'right' }}>Amount</span>
            </div>

            <div style={{ textAlign: 'center', margin: '5px 0' }}>----------------------------------------</div>

            {/* Transactions */}
            <div style={{ marginBottom: '8px' }}>
                {reportData.sales.slice(0, 10).map((sale) => (
                    <div key={sale.id} style={{ marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
                            <span style={{ flex: '1' }}>#{sale.id}</span>
                            <span style={{ flex: '2' }}>{sale.customer_name.length > 12 ? sale.customer_name.substring(0, 12) + '...' : sale.customer_name}</span>
                            <span style={{ flex: '1', textAlign: 'right' }}>{formatCurrency(sale.total_amount)}</span>
                        </div>
                        <div style={{ fontSize: '8px', color: '#666', marginLeft: '20px' }}>
                            {sale.payment_method.toUpperCase()} • {new Date(sale.created_at).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                {reportData.sales.length > 10 && (
                    <div style={{ textAlign: 'center', fontSize: '9px', fontStyle: 'italic', marginTop: '4px' }}>
                        ... and {reportData.sales.length - 10} more
                    </div>
                )}
            </div>

            <div style={{ textAlign: 'center', margin: '8px 0' }}>----------------------------------------</div>

            {/* Items Sold Header */}
            <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px' }}>
                ITEMS SOLD SUMMARY
            </div>

            {/* Items Column Headers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px', fontSize: '9px' }}>
                <span style={{ flex: '2' }}>Item</span>
                <span style={{ flex: '1', textAlign: 'right' }}>Qty</span>
                <span style={{ flex: '1', textAlign: 'right' }}>Total</span>
            </div>

            <div style={{ textAlign: 'center', margin: '5px 0' }}>----------------------------------------</div>

            {/* Items */}
            <div style={{ marginBottom: '8px' }}>
                {Object.entries(itemSummary).map(([tankType, summary]) => (
                    <div key={tankType} style={{ marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
                            <span style={{ flex: '2' }}>{tankType.length > 15 ? tankType.substring(0, 15) + '...' : tankType}</span>
                            <span style={{ flex: '1', textAlign: 'right' }}>{summary.quantity}</span>
                            <span style={{ flex: '1', textAlign: 'right' }}>{formatCurrency(summary.amount)}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', margin: '8px 0' }}>***************************************</div>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '5px' }}>SHIFT COMPLETE</div>
                <div style={{ fontSize: '9px' }}>Thank you for your service</div>
                <div style={{ fontSize: '8px', marginTop: '8px', color: '#666' }}>
                    This is an official end of shift report<br />
                    Keep for business records
                </div>
            </div>

            {/* Signature Lines */}
            <div style={{ marginTop: '15px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '9px', marginBottom: '3px' }}>Cashier Signature:</div>
                    <div style={{ borderBottom: '1px solid black', height: '20px' }}></div>
                </div>
                <div>
                    <div style={{ fontSize: '9px', marginBottom: '3px' }}>Manager Signature:</div>
                    <div style={{ borderBottom: '1px solid black', height: '20px' }}></div>
                </div>
            </div>

            {/* Barcode representation */}
            <div style={{ textAlign: 'center', marginTop: '10px', fontFamily: 'monospace', fontSize: '14px', letterSpacing: '2px' }}>
                ||| || ||| || |||| ||| || |||
            </div>
            <div style={{ textAlign: 'center', fontSize: '9px', marginTop: '2px' }}>
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
        </div>
        </div>
    );
};

export default EndShiftReport;
