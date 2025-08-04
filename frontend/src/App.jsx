// import React from 'react';

// const App = () => {
//   return (
//     <div className=' w-screen p-5 bg-white flex justify-center items-center'>
//       <div className='h-full w-[70%] border-2 border-black'>
//         <div className="title text-4xl font-bold text-center pt-5">ShukhDham Jwellers</div>
//         <div className="second_title text-2xl font-bold text-center pt-7 underline">APPRAISER CERTIFICATE</div>
//         {/* headings */}
//         <div className="heading flex justify-between items-center pt-6 px-20">
//           <div className="left ">The Branch Manager <br /> state Bank of India <br /> .......... Branch</div>
//           <div className="right ">
//             <div className="one px-6">AnneXure - PL-61(1)</div>
//             <div className="two px-6 pt-1.5 ">AC.No : ..............</div>
//           </div>
//         </div>
//         {/* paragraph */}
//         <div className="paragraph flex justify-center  flex-col pt-6 px-20"><p className="mb-2">Dear Sir,</p>
//           <p className="mb-4">
//             I hereby certify that Sri/Smt ................................................. S/W/D of ............................................... Resident of ..............................................
//             who has sought gold loan from the Bank is not my relative and the gold against which the loan is sought is not purchased from me.
//             The ornaments/Coins have been weighted and appraised by me on .................. in the presence of  Sri/Smt ..................... (Cash in charge) and the exact weight, purity of the metal and market value of each item as on date are indicated below:
//           </p>
//         </div>
//         {/* table */}
//         <div className="mb-6 pt-6 px-20">
//           <table className="w-full border-collapse border border-black text-xs">
//             <thead>
//               <tr>
//                 <th className="border border-black p-2 text-left">SI. No.</th>
//                 <th className="border border-black p-2 text-left">Description of the Article</th>
//                 <th className="border border-black p-2 text-left">Gross Weight</th>
//                 <th className="border border-black p-2 text-left">Approximat e weight of the precious stones in the ornaments (Grams)</th>
//                 <th className="border border-black p-2 text-left">Purity (Carat)</th>
//                 <th className="border border-black p-2 text-left">Net Weigh t (Gram s)</th>
//                 <th className="border border-black p-2 text-left">Market Value Rs.</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* Empty rows */}
//               {[...Array(8)].map((_, index) => (
//                 <tr key={index}>
//                   <td className="border border-black p-3 h-8"></td>
//                   <td className="border border-black p-3 h-8"></td>
//                   <td className="border border-black p-3 h-8"></td>
//                   <td className="border border-black p-3 h-8"></td>
//                   <td className="border border-black p-3 h-8"></td>
//                   <td className="border border-black p-3 h-8"></td>
//                   <td className="border border-black p-3 h-8"></td>
//                 </tr>
//               ))}
//               {/* Total row */}
//               <tr>
//                 <td className="border border-black p-2 font-bold" colSpan="2">Total</td>
//                 <td className="border border-black p-2"></td>
//                 <td className="border border-black p-2"></td>
//                 <td className="border border-black p-2"></td>
//                 <td className="border border-black p-2"></td>
//                 <td className="border border-black p-2"></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//         {/* paragraph */}
//         <p className="mb-2 pt-2 px-20">
//           Method(s) used for purity testing:<br />
//           I solemnly declare that weight, purity of the gold ornaments/precious stones indicated above are correct and I undertake to indemnify the Bank against any loss it may sustain on account of any inaccuracy in the above appraisal.
//         </p>

//         <div className="heading flex justify-between items-center pt-6 px-20">
//           <div className="left mb-6"><div>Place :  <br /> Date :</div>
//             <div className='pt-14'>Name and Signature of the Borrower</div>
//           </div>
//           <div className="right ">
//             <div className="one px-6 mb-6
//             ">Yours faithfully</div>
//             <div className="two px-6 pt-9 ">Name & Signature pf the Appraiser</div>
//           </div>
//         </div>
//       </div>


//     </div>
//   );
// };

// export default App;

import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import InstallPWA from './InstallPWA ';

const App = () => {
  const pdfRef = useRef();

  const [formData, setFormData] = useState({
    borrowerName: '',
    relative: '',
    address: '',
    appraisalDate: '',
    presencePerson: '',
    place: '',
    date: '',
    acc: '',
    branch: ''
  });

  const [todaysRate, setTodaysRate] = useState('');
  const [items, setItems] = useState([
    {
      description: '',
      quantity: '',
      grossWeight: '',
      stoneWeight: '',
      purity: ' ',
      itemRate: ''
    }
  ]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateNetWeight = (gross, stone) => {
    const g = parseFloat(gross);
    const s = parseFloat(stone);
    if (!isNaN(g) && !isNaN(s)) {
      const result = g - s;
      return result > 0 ? result.toFixed(2) : '0.00';
    }
    return '';
  };

  const calculateValue = (netWeight, purity, rate) => {
    const net = parseFloat(netWeight);
    const pur = parseFloat(purity);
    const rt = parseFloat(rate || todaysRate);

    if (!isNaN(net) && !isNaN(pur) && !isNaN(rt)) {
      // Calculate based on purity (22 carat is standard)
      const purityFactor = pur / 22;
      return ((net * rt * purityFactor) / 10).toFixed(2);
    }
    return '';
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    const gross = field === 'grossWeight' ? value : updated[index].grossWeight;
    const stone = field === 'stoneWeight' ? value : updated[index].stoneWeight;
    const netWeight = calculateNetWeight(gross, stone);
    updated[index].netWeight = netWeight;

    const purity = updated[index].purity;
    const itemRate = updated[index].itemRate || todaysRate;
    updated[index].value = calculateValue(netWeight, purity, itemRate);

    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, {
      description: '',
      quantity: '',
      grossWeight: '',
      stoneWeight: '',
      purity: ' ',
      itemRate: '',
      netWeight: '',
      value: ''
    }]);
  };

  const handleDownload = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 9,
      filename: 'Appraiser-Certificate.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        letterRendering: true,
        useCORS: true,
        width: 850,
        minHeight: 1000,
        windowWidth: 850
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: 'avoid-all' }
    };

    const originalWidth = element.style.width;
    element.style.width = '850px';

    html2pdf().set(opt).from(element).save().then(() => {
      element.style.width = originalWidth;
    });
  };
  const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  };

  const totals = items.reduce((acc, curr) => {
    acc.gross += parseFloat(curr.grossWeight) || 0;
    acc.stone += parseFloat(curr.stoneWeight) || 0;
    acc.net += parseFloat(curr.netWeight) || 0;
    acc.value += parseFloat(curr.value) || 0;
    return acc;
  }, { gross: 0, stone: 0, net: 0, value: 0 });

  return (
    <div className="w-screen min-h-screen bg-white p-5">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Enter Certificate Details</h2>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="borrowerName" placeholder="Borrower's Name" className="border p-2" onChange={handleInputChange} />
          <input type="text" name="relative" placeholder="Relative Name" className="border p-2" onChange={handleInputChange} />
          <input type="text" name="address" placeholder="Address" className="border p-2" onChange={handleInputChange} />
          <input type="date" name="appraisalDate" className="border p-2" onChange={handleInputChange} />
          <input type="text" name="presencePerson" placeholder="Presence of (Person)" className="border p-2" onChange={handleInputChange} />
          <input type="text" name="place" placeholder="Place" className="border p-2" onChange={handleInputChange} />
          <input type="date" name="date" className="border p-2" onChange={handleInputChange} />
          <input type="text" name="acc" placeholder="Customer Account Number" className="border p-2" onChange={handleInputChange} />
          <input type="text" name="branch" placeholder="Branch Name" className="border p-2" onChange={handleInputChange} />
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Add Article Rows</h3>
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-2">
            <input className="border p-1" placeholder="Description" value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} />
            <input className="border p-1" placeholder="Quantity" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} />
            <input className="border p-1" placeholder="Gross Wt" value={item.grossWeight} onChange={e => handleItemChange(idx, 'grossWeight', e.target.value)} />
            <input className="border p-1" placeholder="Stone Wt" value={item.stoneWeight} onChange={e => handleItemChange(idx, 'stoneWeight', e.target.value)} />
            <select className="border p-1" value={item.purity} onChange={e => handleItemChange(idx, 'purity', e.target.value)}>
              <option value=" ">select purity</option>
              <option value="18">18</option>
              <option value="20">20</option>
              <option value="22">22</option>
              <option value="24">24</option>
            </select>
            <input
              className="border p-1"
              placeholder="Rate (₹/10g)"
              value={item.itemRate}
              onChange={e => handleItemChange(idx, 'itemRate', e.target.value)}
            />
            <input className="border p-1" placeholder="Value ₹" value={item.value} readOnly />
          </div>
        ))}
        <button onClick={addItemRow} className="bg-green-500 text-white px-4 py-1 mt-2 rounded hover:bg-green-600">Add Row</button>
      </div>

      <button
        onClick={handleDownload}
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Download PDF
      </button>

      {/* PDF Section */}
      <div
        ref={pdfRef}
        className='pdf-container bg-white mx-auto'
        style={{
          width: '800px',
          minHeight: '1000px',
          padding: '10px',
          border: '2px solid black',
        }}
      >
        {/* main heading */}
        <div
          style={{
            color: "#101828"
          }}
          className="text-4xl font-bold  text-center pt-5">
          ShukhDham Jwellers
        </div>

        {/* acknowledgement */}
        <div style={{
          color: "#364153"
        }} className="text-xl font-semibold  text-center pt-2">
          (Rakesh.j.soni) A.C : 10681641274
        </div>

        {/* subheading */}
        <div style={{
          color: "#1e2939",
          textDecorationColor: "#6a7282"
        }} className="text-2xl font-bold text-center pt-7 underline underline-offset-4 ">
          APPRAISER CERTIFICATE
        </div>



        <div className="flex justify-between items-center pt-6 px-12">
          <div>
            The Branch Manager <br /> State Bank of India <br /> <strong>{formData.branch || "................"}</strong> Branch
          </div>
          <div className="text-right">
            <div className="px-6">AnneXure - PL-61(1)</div>
            <div className="px-6 pt-1.5">AC.No : <strong>{formData.acc || "................"}</strong></div>
          </div>
        </div>

        <div className="pt-6 px-12 text-sm leading-tight">
          <p className="mb-2">Dear Sir,</p>
          <p>
            I hereby certify that Sri/Smt <strong>{formData.borrowerName || "................"}</strong> S/W/D of <strong>{formData.relative || "................"}</strong> Resident of <strong>{formData.address}</strong> who has sought gold loan from the Bank is not my relative and the gold against which the loan is sought is not purchased from me.
            The ornaments/Coins have been weighted and appraised by me on <strong> {formData.appraisalDate ? formatDate(formData.appraisalDate) : "................"}</strong> in the presence of <strong>{formData.presencePerson || "................"}</strong> (Cash in charge) and the exact weight, purity of the metal and market value of each item as on date are indicated below:
          </p>
        </div>
        <div className="pt-6 px-10 text-xs overflow-x-auto">
          <table className="w-full h-full table-fixed border-collapse border border-black text-center">
            <thead style={{
              backgroundColor: "#f3f4f6"
            }} className="font-medium text-[16px] ">
              <tr>
                <th className="border border-black p-2 align-middle" rowSpan="2">SI. No.</th>
                <th className="border border-black p-2 align-middle" colSpan="2">Description of the Article</th>
                <th className="border border-black p-2 align-middle" rowSpan="2">Gross Weight</th>
                <th className="border border-black p-2 align-middle w-[100px]" rowSpan="2">
                  Approx. weight of precious stones in the ornaments <br />(Grams)
                </th>
                <th className="border border-black p-2 align-middle  w-[60px]" rowSpan="2">Purity <br />(Carat)</th>
                <th className="border border-black p-2 align-middle  w-[70px]" rowSpan="2">Net Weight <br />(Grams)</th>
                <th className="border border-black p-2 align-middle w-[100px]" rowSpan="2">Market Value Rs.</th>
              </tr>
              <tr>
                <th className="border border-black p-2 align-middle w-[70%]">Name</th>
                <th className="border border-black p-2 align-middle w-[30%]">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className={`text-[15px] bg-white`}>
                  <td className="border border-black p-2 align-middle">{index + 1}</td>
                  <td className="border border-black p-2 align-middle">{item.description}</td>
                  <td className="border border-black p-2 align-middle">{item.quantity}</td>
                  <td className="border border-black p-2 align-middle">{item.grossWeight}</td>
                  <td className="border border-black p-2 align-middle">{item.stoneWeight}</td>
                  <td className="border border-black p-2 align-middle">{item.purity}</td>
                  <td className="border border-black p-2 align-middle">{item.netWeight}</td>
                  <td className="border border-black p-2 align-middle">{item.value}</td>
                </tr>
              ))}
              <tr style={{
                backgroundColor: "#f3f4f6"
              }} className="font-semibold text-[15px]">
                <td className="border border-black p-2 align-middle" colSpan="3">Grand Total</td>
                <td className="border border-black p-2 align-middle">{totals.gross.toFixed(2)}</td>
                <td className="border border-black p-2 align-middle">{totals.stone.toFixed(2)}</td>
                <td className="border border-black p-2 align-middle">--</td>
                <td className="border border-black p-2 align-middle">{totals.net.toFixed(2)}</td>
                <td className="border border-black p-2 align-middle">{totals.value.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>


        <p className="pt-4 px-12 text-sm leading-tight">
          Method(s) used for purity testing:<br />
          I solemnly declare that weight, purity of the gold ornaments/precious stones indicated above are correct and I undertake to indemnify
          the Bank against any loss it may sustain on account of any inaccuracy in the above appraisal.
        </p>

        <div className="flex justify-between items-center pt-[0.5px] px-12 pb-10">
          <div>
            <div>Place: {formData.place || "................"}<br />Date: {formData.date ? formatDate(formData.date) : "................"}</div>
            <div className="pt-14">Name and Signature of the Borrower</div>
          </div>
          <div className="text-right">
            <div className="mb-6">Yours faithfully</div>
            <div className="pt-9">Name & Signature of the Appraiser</div>
          </div>
        </div>
      </div>
      <InstallPWA />
    </div>

  );
};

export default App;




