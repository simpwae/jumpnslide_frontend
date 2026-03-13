import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  StarIcon,
  CheckCircle2Icon,
  PlusIcon,
  MinusIcon,
  AlertCircleIcon } from
'lucide-react';
import { PACKAGES, EQUIPMENT } from '../data';
import { motion, AnimatePresence } from 'framer-motion';
export function PackagePage() {
  const { slug } = useParams<{
    slug: string;
  }>();
  const navigate = useNavigate();
  const pkg = PACKAGES.find((p) => p.slug === slug);
  // Wizard State
  const [selectedInflatable, setSelectedInflatable] = useState<string | null>(
    null
  );
  const [wantsPool, setWantsPool] = useState(false);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [servings, setServings] = useState<Record<string, number>>({});
  const [extras, setExtras] = useState<Record<string, number>>({
    chairs: 0,
    tables: 0
  });
  // Mobile accordion state
  const [activeSection, setActiveSection] = useState<string>('inflatables');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  if (!pkg) {
    return <div className="pt-32 text-center h-screen">Package not found.</div>;
  }
  // Derived Data
  const availableInflatables = EQUIPMENT.filter((e) => {
    if (pkg.inclusions.inflatableOptions.includes('all'))
    return e.category === 'slide' || e.category === 'bouncy';
    if (pkg.inclusions.inflatableOptions.includes('slides'))
    return e.category === 'slide';
    if (pkg.inclusions.inflatableOptions.includes('bouncies'))
    return e.category === 'bouncy';
    return false;
  });
  const availableMachines = EQUIPMENT.filter((e) => e.category === 'machine');
  const currentInflatable = EQUIPMENT.find((e) => e.id === selectedInflatable);
  const isPoolAllowed = currentInflatable?.isLarge;
  // Reset pool if inflatable changes to small
  useEffect(() => {
    if (!isPoolAllowed) setWantsPool(false);
  }, [selectedInflatable, isPoolAllowed]);
  // Handlers
  const toggleMachine = (id: string) => {
    if (selectedMachines.includes(id)) {
      setSelectedMachines((prev) => prev.filter((m) => m !== id));
      const newServings = {
        ...servings
      };
      delete newServings[id];
      setServings(newServings);
    } else {
      if (selectedMachines.length >= pkg.inclusions.selectableMachines) {
        alert(
          `You can only select ${pkg.inclusions.selectableMachines} machines for this package.`
        );
        return;
      }
      setSelectedMachines((prev) => [...prev, id]);
      setServings((prev) => ({
        ...prev,
        [id]: pkg.servingsPerMachine
      }));
    }
  };
  const updateServings = (id: string, delta: number) => {
    const current = servings[id] || pkg.servingsPerMachine;
    const next = current + delta;
    if (next >= pkg.servingsPerMachine) {
      setServings((prev) => ({
        ...prev,
        [id]: next
      }));
    }
  };
  const updateExtra = (key: string, delta: number) => {
    const current = extras[key] || 0;
    const next = Math.max(0, current + delta);
    setExtras((prev) => ({
      ...prev,
      [key]: next
    }));
  };
  // Pricing Calculation
  const EXTRA_SERVING_PRICE = 50; // AED per 10 extra
  const EXTRA_CHAIR_PRICE = 10;
  const EXTRA_TABLE_PRICE = 30;
  let extrasTotal = 0;
  // Calculate extras total for fixed machines as well
  const allServings = {
    ...servings
  };
  pkg.inclusions.fixedMachines.forEach((id) => {
    if (!allServings[id]) allServings[id] = pkg.servingsPerMachine;
  });
  Object.entries(allServings).forEach(([id, qty]) => {
    if (qty > pkg.servingsPerMachine) {
      extrasTotal += (qty - pkg.servingsPerMachine) / 10 * EXTRA_SERVING_PRICE;
    }
  });
  extrasTotal += extras.chairs * EXTRA_CHAIR_PRICE;
  extrasTotal += extras.tables * EXTRA_TABLE_PRICE;
  if (wantsPool && pkg.inclusions.poolOption === 'optional') extrasTotal += 200; // Mock pool price
  const total = pkg.price + extrasTotal;
  const advance = Math.ceil(total / 2);
  const isComplete =
  (pkg.inclusions.selectableInflatables === 0 ||
  selectedInflatable !== null) && (
  pkg.inclusions.selectableMachines === 0 ||
  selectedMachines.length === pkg.inclusions.selectableMachines);
  const hasChairsOrTables = pkg.inclusions.fixedItems.some(
    (item) =>
    item.toLowerCase().includes('chair') ||
    item.toLowerCase().includes('table')
  );
  const updateFixedMachineServings = (id: string, delta: number) => {
    const current = allServings[id] || pkg.servingsPerMachine;
    const next = current + delta;
    if (next >= pkg.servingsPerMachine) {
      setServings((prev) => ({
        ...prev,
        [id]: next
      }));
    }
  };
  return (
    <main className="pt-20 bg-gray-50 min-h-screen pb-24">
      {/* Section 1: Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {pkg.tag &&
          <span className="inline-block px-3 py-1 bg-brand-light text-brand-pink text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              {pkg.tag.label}
            </span>
          }
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-brand-navy mb-4">
            {pkg.name}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-6">
            <div className="text-3xl font-extrabold text-brand-navy">
              AED {pkg.price.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <StarIcon className="w-5 h-5 text-amber-400 fill-amber-400 mr-1" />
              <span className="font-bold text-brand-navy mr-1">
                {pkg.rating}
              </span>
              <span className="underline cursor-pointer">
                ({pkg.reviewCount} reviews)
              </span>
            </div>
          </div>

          <p className="text-gray-600 max-w-2xl text-lg">{pkg.description}</p>
          <div className="mt-6 inline-flex items-center text-sm font-medium text-brand-blue bg-blue-50 px-4 py-2 rounded-lg">
            ⏱️ Duration: {pkg.duration} · 💳 50% advance to confirm
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details & Wizard */}
          <div className="lg:col-span-2 space-y-12">
            {/* Section 2: What's Included (Typography Only) */}
            <section>
              <h2 className="font-heading font-bold text-2xl text-brand-navy mb-6">
                What's Included
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <ul className="space-y-4">
                  {pkg.inclusions.selectableInflatables > 0 &&
                  <li className="flex justify-between items-baseline border-b border-gray-50 pb-4">
                      <div>
                        <span className="font-medium text-brand-navy block text-lg">
                          Inflatable Setup
                        </span>
                        <span
                        className="text-sm text-brand-blue cursor-pointer"
                        onClick={() => setActiveSection('inflatables')}>
                        
                          (Choose from {availableInflatables.length} options)
                        </span>
                      </div>
                    </li>
                  }
                  {pkg.inclusions.selectableMachines > 0 &&
                  <li className="flex justify-between items-baseline border-b border-gray-50 pb-4">
                      <div>
                        <span className="font-medium text-brand-navy block text-lg">
                          Snack Machines
                        </span>
                        <span
                        className="text-sm text-brand-blue cursor-pointer"
                        onClick={() => setActiveSection('machines')}>
                        
                          (Choose {pkg.inclusions.selectableMachines} options)
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {pkg.servingsPerMachine} servings each
                      </span>
                    </li>
                  }
                  {pkg.inclusions.fixedMachines.length > 0 &&
                  <li className="flex justify-between items-baseline border-b border-gray-50 pb-4">
                      <div>
                        <span className="font-medium text-brand-navy block text-lg">
                          Included Snacks
                        </span>
                        <span className="text-sm text-gray-500 block">
                          {pkg.inclusions.fixedMachines.
                        map(
                          (id) => EQUIPMENT.find((e) => e.id === id)?.name
                        ).
                        join(' · ')}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {pkg.servingsPerMachine} servings each
                      </span>
                    </li>
                  }
                  {pkg.inclusions.fixedItems.length > 0 &&
                  <li className="flex justify-between items-baseline border-b border-gray-50 pb-4">
                      <div>
                        <span className="font-medium text-brand-navy block text-lg">
                          Equipment & Setup
                        </span>
                        <span className="text-sm text-gray-500 block">
                          {pkg.inclusions.fixedItems.join(' · ')}
                        </span>
                      </div>
                    </li>
                  }
                  {pkg.inclusions.freeItems.length > 0 &&
                  <li className="flex justify-between items-baseline pt-2">
                      <div>
                        <span className="font-medium text-brand-navy block text-lg">
                          Complimentary Add-ons
                        </span>
                        <span className="text-sm text-gray-500 block">
                          {pkg.inclusions.freeItems.join(' · ')}
                        </span>
                      </div>
                      <span className="font-bold text-green-600 uppercase text-sm tracking-wider">
                        Free
                      </span>
                    </li>
                  }
                </ul>
              </div>
            </section>

            {/* Section 3: Customization Wizard */}
            <section>
              <h2 className="font-heading font-bold text-2xl text-brand-navy mb-6">
                Customize Your Package
              </h2>

              <div className="space-y-6">
                {/* 3A: Inflatables */}
                {pkg.inclusions.selectableInflatables > 0 &&
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-brand-navy">
                        1. Choose Inflatable
                      </h3>
                      <span className="text-sm font-medium text-gray-500">
                        Selected: {selectedInflatable ? '1' : '0'}/1
                      </span>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {availableInflatables.map((item) =>
                    <div
                      key={item.id}
                      onClick={() => setSelectedInflatable(item.id)}
                      className={`cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${selectedInflatable === item.id ? 'border-green-500 shadow-md' : 'border-gray-100 hover:border-brand-blue/50'}`}>
                      
                          <div
                        className={`h-24 bg-gradient-to-br ${item.imagePlaceholder} relative`}>
                        
                            {selectedInflatable === item.id &&
                        <div className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                                <CheckCircle2Icon className="w-5 h-5 text-green-500" />
                              </div>
                        }
                          </div>
                          <div className="p-3 text-center">
                            <p className="font-medium text-sm text-brand-navy">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.isLarge ? 'Large' : 'Small'}
                            </p>
                          </div>
                        </div>
                    )}
                    </div>
                  </div>
                }

                {/* 3B: Pool Toggle */}
                {pkg.inclusions.poolOption !== 'none' &&
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-brand-navy">
                        Add Inflatable Pool
                      </h3>
                      {pkg.inclusions.poolOption === 'included' ?
                    <p className="text-sm text-green-600 font-medium">
                          Included free in this package
                        </p> :

                    <p className="text-sm text-gray-500">+ AED 200</p>
                    }
                      {!isPoolAllowed && selectedInflatable &&
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                          <AlertCircleIcon className="w-3 h-3 mr-1" /> Available
                          with large inflatables only
                        </p>
                    }
                    </div>
                    <button
                    disabled={!isPoolAllowed}
                    onClick={() => setWantsPool(!wantsPool)}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${wantsPool ? 'bg-brand-blue' : 'bg-gray-200'} ${!isPoolAllowed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    
                      <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${wantsPool ? 'translate-x-8' : 'translate-x-1'}`} />
                    
                    </button>
                  </div>
                }

                {/* 3C: Snack Machines */}
                {pkg.inclusions.selectableMachines > 0 &&
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-brand-navy">
                        2. Choose Snack Machines
                      </h3>
                      <span
                      className={`text-sm font-medium ${selectedMachines.length === pkg.inclusions.selectableMachines ? 'text-green-600' : 'text-gray-500'}`}>
                      
                        Selected: {selectedMachines.length}/
                        {pkg.inclusions.selectableMachines}
                      </span>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {availableMachines.map((item) =>
                    <div
                      key={item.id}
                      onClick={() => toggleMachine(item.id)}
                      className={`cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${selectedMachines.includes(item.id) ? 'border-green-500 shadow-md' : 'border-gray-100 hover:border-brand-blue/50'} ${!selectedMachines.includes(item.id) && selectedMachines.length >= pkg.inclusions.selectableMachines ? 'opacity-50' : ''}`}>
                      
                          <div
                        className={`h-20 bg-gradient-to-br ${item.imagePlaceholder} relative`}>
                        
                            {selectedMachines.includes(item.id) &&
                        <div className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                                <CheckCircle2Icon className="w-4 h-4 text-green-500" />
                              </div>
                        }
                          </div>
                          <div className="p-2 text-center">
                            <p className="font-medium text-xs text-brand-navy">
                              {item.name}
                            </p>
                          </div>
                        </div>
                    )}
                    </div>

                    {/* 3D: Servings */}
                    {selectedMachines.length > 0 &&
                  <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        <h4 className="font-medium text-brand-navy mb-4">
                          Servings per machine
                        </h4>
                        <div className="space-y-4">
                          {selectedMachines.map((id) => {
                        const machine = EQUIPMENT.find((e) => e.id === id);
                        const qty = allServings[id];
                        const isExtra = qty > pkg.servingsPerMachine;
                        return (
                          <div
                            key={id}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                            
                                <div>
                                  <span className="font-medium text-sm text-brand-navy block">
                                    {machine?.name}
                                  </span>
                                  {isExtra ?
                              <span className="text-xs text-brand-pink font-medium">
                                      + AED{' '}
                                      {(qty - pkg.servingsPerMachine) / 10 *
                                EXTRA_SERVING_PRICE}
                                    </span> :

                              <span className="text-xs text-green-600">
                                      Included ✅
                                    </span>
                              }
                                </div>
                                <div className="flex items-center space-x-3">
                                  <button
                                onClick={() => updateServings(id, -10)}
                                disabled={qty <= pkg.servingsPerMachine}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50">
                                
                                    <MinusIcon className="w-4 h-4" />
                                  </button>
                                  <span className="font-bold w-8 text-center">
                                    {qty}
                                  </span>
                                  <button
                                onClick={() => updateServings(id, 10)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                                
                                    <PlusIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>);

                      })}
                        </div>
                      </div>
                  }
                  </div>
                }

                {/* Fixed Machines Servings (if any) */}
                {pkg.inclusions.fixedMachines.length > 0 &&
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gray-50 border-b border-gray-100">
                      <h3 className="font-bold text-lg text-brand-navy">
                        {pkg.inclusions.selectableMachines > 0 ? '3' : '2'}.
                        Extra Snack Servings
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Your package includes {pkg.servingsPerMachine} servings
                        per machine.
                      </p>
                    </div>
                    <div className="p-6 space-y-4">
                      {pkg.inclusions.fixedMachines.map((id) => {
                      const machine = EQUIPMENT.find((e) => e.id === id);
                      const qty = allServings[id];
                      const isExtra = qty > pkg.servingsPerMachine;
                      return (
                        <div
                          key={id}
                          className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                          
                            <div>
                              <span className="font-medium text-sm text-brand-navy block">
                                {machine?.name}
                              </span>
                              {isExtra ?
                            <span className="text-xs text-brand-pink font-medium">
                                  + AED{' '}
                                  {(qty - pkg.servingsPerMachine) / 10 *
                              EXTRA_SERVING_PRICE}
                                </span> :

                            <span className="text-xs text-green-600">
                                  Included ✅
                                </span>
                            }
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                              onClick={() =>
                              updateFixedMachineServings(id, -10)
                              }
                              disabled={qty <= pkg.servingsPerMachine}
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50">
                              
                                <MinusIcon className="w-4 h-4" />
                              </button>
                              <span className="font-bold w-8 text-center">
                                {qty}
                              </span>
                              <button
                              onClick={() =>
                              updateFixedMachineServings(id, 10)
                              }
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                              
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>);

                    })}
                    </div>
                  </div>
                }

                {/* 3E: Need More? (Extras) */}
                {hasChairsOrTables &&
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gray-50 border-b border-gray-100">
                      <h3 className="font-bold text-lg text-brand-navy">
                        {pkg.inclusions.selectableMachines > 0 &&
                      pkg.inclusions.fixedMachines.length > 0 ?
                      '4' :
                      pkg.inclusions.selectableMachines > 0 ||
                      pkg.inclusions.fixedMachines.length > 0 ?
                      '3' :
                      '2'}
                        . Need More? (Extras)
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-brand-navy block">
                            Extra Kids Chairs
                          </span>
                          <span className="text-xs text-gray-500">
                            + AED {EXTRA_CHAIR_PRICE} each
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                          onClick={() => updateExtra('chairs', -1)}
                          disabled={extras.chairs === 0}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50">
                          
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-6 text-center">
                            {extras.chairs}
                          </span>
                          <button
                          onClick={() => updateExtra('chairs', 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <span className="font-medium text-brand-navy block">
                            Extra Kids Tables
                          </span>
                          <span className="text-xs text-gray-500">
                            + AED {EXTRA_TABLE_PRICE} each
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                          onClick={() => updateExtra('tables', -1)}
                          disabled={extras.tables === 0}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50">
                          
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-6 text-center">
                            {extras.tables}
                          </span>
                          <button
                          onClick={() => updateExtra('tables', 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="font-heading font-bold text-2xl text-brand-navy mb-6">
                Your Party
              </h2>

              <div className="space-y-4 mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between">
                  <span className="font-medium text-brand-navy">
                    {pkg.name} Base
                  </span>
                  <span className="font-medium">AED {pkg.price}</span>
                </div>

                {selectedInflatable &&
                <div className="flex justify-between text-sm text-gray-600 pl-2 border-l-2 border-brand-blue">
                    <span>
                      {EQUIPMENT.find((e) => e.id === selectedInflatable)?.name}
                    </span>
                    <span>Included</span>
                  </div>
                }

                {wantsPool &&
                <div className="flex justify-between text-sm text-gray-600 pl-2 border-l-2 border-brand-blue">
                    <span>Inflatable Pool</span>
                    <span>
                      {pkg.inclusions.poolOption === 'included' ?
                    'Included' :
                    '+ AED 200'}
                    </span>
                  </div>
                }

                {Object.entries(allServings).map(([id, qty]) => {
                  if (
                  qty <= pkg.servingsPerMachine &&
                  !selectedMachines.includes(id))

                  return null;
                  return (
                    <div
                      key={id}
                      className="flex justify-between text-sm text-gray-600 pl-2 border-l-2 border-brand-pink">
                      
                      <span>
                        {EQUIPMENT.find((e) => e.id === id)?.name} ({qty}{' '}
                        servings)
                      </span>
                      <span>
                        {qty > pkg.servingsPerMachine ?
                        `+ AED ${(qty - pkg.servingsPerMachine) / 10 * EXTRA_SERVING_PRICE}` :
                        'Included'}
                      </span>
                    </div>);

                })}

                {extras.chairs > 0 &&
                <div className="flex justify-between text-sm text-gray-600 pl-2 border-l-2 border-gray-300">
                    <span>Extra Chairs (x{extras.chairs})</span>
                    <span>+ AED {extras.chairs * EXTRA_CHAIR_PRICE}</span>
                  </div>
                }

                {extras.tables > 0 &&
                <div className="flex justify-between text-sm text-gray-600 pl-2 border-l-2 border-gray-300">
                    <span>Extra Tables (x{extras.tables})</span>
                    <span>+ AED {extras.tables * EXTRA_TABLE_PRICE}</span>
                  </div>
                }
              </div>

              <div className="space-y-2 mb-8">
                <div className="flex justify-between items-center text-lg font-bold text-brand-navy">
                  <span>Total Estimated</span>
                  <span>AED {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-brand-blue font-medium bg-blue-50 p-2 rounded">
                  <span>Pay Now (50% Advance)</span>
                  <span>AED {advance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 px-2">
                  <span>Pay on Delivery</span>
                  <span>AED {(total - advance).toLocaleString()}</span>
                </div>
              </div>

              {!isComplete ?
              <div className="text-center p-3 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium mb-4">
                  Please complete your selections above to book.
                </div> :
              null}

              <button
                disabled={!isComplete}
                onClick={() => navigate(`/book/${pkg.slug}`)}
                className="w-full py-4 bg-gradient-brand text-white rounded-xl font-bold text-lg hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                
                Reserve My Date
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                Delivery charges calculated at next step
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>);

}