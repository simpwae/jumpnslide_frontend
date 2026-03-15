import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StarIcon, PlusIcon, MinusIcon, AlertCircleIcon } from 'lucide-react';
import { PACKAGES, EQUIPMENT } from '../data';
import { ItemCard } from '../components/ItemCard';
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
  const [machineError, setMachineError] = useState('');
  const [wantsPool, setWantsPool] = useState(false);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [servings, setServings] = useState<Record<string, number>>({});
  const [extras, setExtras] = useState<Record<string, number>>({
    chairs: 0,
    tables: 0
  });
  const [selectedFreeItem, setSelectedFreeItem] = useState<string | null>(null);
  useEffect(() => {
  window.scrollTo(0, 0);
  setSelectedInflatable(null);
  setSelectedMachines([]);
  setServings({});
  setWantsPool(false);
  setExtras({ chairs: 0, tables: 0 });
  setSelectedFreeItem(null);
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
            setMachineError(`You can only select ${pkg.inclusions.selectableMachines} machines.`);
            setTimeout(() => setMachineError(''), 3000);
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
  const EXTRA_SERVING_PRICE = 50;
  const EXTRA_CHAIR_PRICE = 10;
  const EXTRA_TABLE_PRICE = 30;
  let extrasTotal = 0;
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
  if (wantsPool && pkg.inclusions.poolOption === 'optional') extrasTotal += 200;
  const total = pkg.price + extrasTotal;
  const advance = Math.ceil(total / 2);
  // Validation
  const hasFreeChoice = pkg.inclusions.freeItems.some((i) => i.isChoice === true);
  const isComplete =
  (pkg.inclusions.selectableInflatables === 0 ||
  selectedInflatable !== null) && (
  pkg.inclusions.selectableMachines === 0 ||
  selectedMachines.length === pkg.inclusions.selectableMachines) && (
  !hasFreeChoice || selectedFreeItem !== null);
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
  // Parse Free Items for choices
  const parsedFreeItems = pkg.inclusions.freeItems.flatMap((item) => {
  if (item.isChoice && item.name === 'Mini Bouncy Castle (Unicorn or Spider-Man)') {
    return [
      { id: 'free-unicorn', name: 'Mini Bouncy Castle (Unicorn)', gradient: 'from-fuchsia-300 to-cyan-300', isChoice: true },
      { id: 'free-spiderman', name: 'Mini Bouncy Castle (Spider-Man)', gradient: 'from-red-600 to-blue-600', isChoice: true }
    ];
  }
  return [{ id: item.name, name: item.name, gradient: 'from-brand-blue to-brand-purple', isChoice: false }];
});

  return (
    <main className="pt-20 bg-gray-50 min-h-screen pb-24">
      {/* Header */}
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
          {/* Left Column: Customization Flow */}
          <div className="lg:col-span-2 space-y-10">
            {/* 1. Main Feature (Inflatables / Playgrounds) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-2xl text-brand-navy">
                  1. Main Feature
                </h2>
                {pkg.inclusions.selectableInflatables > 0 &&
                <span className="text-sm font-medium text-gray-500">
                    Choose 1
                  </span>
                }
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pkg.inclusions.selectableInflatables > 0 ?
                availableInflatables.map((item) =>
                <ItemCard
                  key={item.id}
                  title={item.name}
                  subtitle={item.isLarge ? 'Large' : 'Standard'}
                  gradient={item.imagePlaceholder}
                  selectable={true}
                  selected={selectedInflatable === item.id}
                  onClick={() => setSelectedInflatable(item.id)} />

                ) :
                pkg.inclusions.fixedItems.
                filter((i) => i.toLowerCase().includes('playground')).
                map((item, idx) =>
                <ItemCard
                  key={idx}
                  title={item}
                  gradient="from-green-500 to-emerald-700"
                  badge={{
                    text: 'Included',
                    variant: 'included'
                  }} />

                )}
              </div>
            </section>

            {/* 2. Pool (If applicable) */}
            {pkg.inclusions.poolOption !== 'none' &&
            <section>
                <h2 className="font-heading font-bold text-2xl text-brand-navy mb-4">
                  2. Splash Pool
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <ItemCard
                    title="Inflatable Pool"
                    subtitle={
                    pkg.inclusions.poolOption === 'included' ?
                    'Included free' :
                    '+ AED 200'
                    }
                    gradient="from-cyan-400 to-blue-500"
                    badge={
                    pkg.inclusions.poolOption === 'included' ?
                    {
                      text: 'Included',
                      variant: 'included'
                    } :
                    undefined
                    } />
                  
                    {pkg.inclusions.poolOption === 'optional' &&
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-xl shadow-sm flex items-center gap-3">
                        <span className="text-sm font-bold text-brand-navy">
                          Add Pool?
                        </span>
                        <button
                      disabled={!isPoolAllowed}
                      onClick={() => setWantsPool(!wantsPool)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${wantsPool ? 'bg-brand-blue' : 'bg-gray-200'} ${!isPoolAllowed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                      
                          <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${wantsPool ? 'translate-x-8' : 'translate-x-1'}`} />
                      
                        </button>
                      </div>
                  }
                  </div>
                </div>
                {!isPoolAllowed &&
              selectedInflatable &&
              pkg.inclusions.poolOption === 'optional' &&
              <p className="text-sm text-red-500 mt-2 flex items-center">
                      <AlertCircleIcon className="w-4 h-4 mr-1" /> Pool is only
                      available with large inflatables.
                    </p>
              }
              </section>
            }

            {/* 3. Snacks */}
            {(pkg.inclusions.selectableMachines > 0 ||
            pkg.inclusions.fixedMachines.length > 0) &&
            <section>
              {machineError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium mb-4">
                    {machineError}
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-bold text-2xl text-brand-navy">
                    {pkg.inclusions.poolOption !== 'none' ? '3' : '2'}. Party
                    Snacks
                  </h2>
                  {pkg.inclusions.selectableMachines > 0 &&
                <span
                  className={`text-sm font-medium ${selectedMachines.length === pkg.inclusions.selectableMachines ? 'text-green-600' : 'text-gray-500'}`}>
                  
                      Choose {pkg.inclusions.selectableMachines}
                    </span>
                }
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {pkg.inclusions.selectableMachines > 0 ?
                availableMachines.map((item) =>
                <ItemCard
                  key={item.id}
                  title={item.name}
                  gradient={item.imagePlaceholder}
                  selectable={true}
                  selected={selectedMachines.includes(item.id)}
                  disabled={
                  !selectedMachines.includes(item.id) &&
                  selectedMachines.length >=
                  pkg.inclusions.selectableMachines
                  }
                  onClick={() => toggleMachine(item.id)} />

                ) :
                pkg.inclusions.fixedMachines.map((id) => {
                  const machine = EQUIPMENT.find((e) => e.id === id);
                  return (
                    <ItemCard
                      key={id}
                      title={machine?.name || id}
                      gradient={
                      machine?.imagePlaceholder ||
                      'from-gray-200 to-gray-300'
                      }
                      badge={{
                        text: 'Included',
                        variant: 'included'
                      }} />);


                })}
                </div>

                {/* Extra Servings Section */}
                {(selectedMachines.length > 0 ||
              pkg.inclusions.fixedMachines.length > 0) &&
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h4 className="font-bold text-brand-navy mb-4">
                      Need Extra Servings?
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Package includes {pkg.servingsPerMachine} servings per
                      machine.
                    </p>

                    <div className="space-y-3">
                      {[
                  ...selectedMachines,
                  ...pkg.inclusions.fixedMachines].
                  map((id) => {
                    const machine = EQUIPMENT.find((e) => e.id === id);
                    const qty = allServings[id] || pkg.servingsPerMachine;
                    const isExtra = qty > pkg.servingsPerMachine;
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                        
                            <div>
                              <span className="font-medium text-brand-navy block">
                                {machine?.name}
                              </span>
                              {isExtra ?
                          <span className="text-xs text-brand-pink font-bold">
                                  + AED{' '}
                                  {(qty - pkg.servingsPerMachine) / 10 *
                            EXTRA_SERVING_PRICE}
                                </span> :

                          <span className="text-xs text-green-600 font-medium">
                                  Included
                                </span>
                          }
                            </div>
                            <div className="flex items-center space-x-3 bg-white rounded-lg border border-gray-200 p-1">
                              <button
                            onClick={() =>
                            updateFixedMachineServings(id, -10)
                            }
                            disabled={qty <= pkg.servingsPerMachine}
                            className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center disabled:opacity-50 hover:bg-gray-100">
                            
                                <MinusIcon className="w-4 h-4" />
                              </button>
                              <span className="font-bold w-8 text-center text-brand-navy">
                                {qty}
                              </span>
                              <button
                            onClick={() =>
                            updateFixedMachineServings(id, 10)
                            }
                            className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center hover:bg-gray-100">
                            
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>);

                  })}
                    </div>
                  </div>
              }
              </section>
            }

            {/* 4. Party Essentials */}
            {pkg.inclusions.fixedItems.filter(
              (i) => !i.toLowerCase().includes('playground')
            ).length > 0 &&
            <section>
                <h2 className="font-heading font-bold text-2xl text-brand-navy mb-4">
                  Party Essentials
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {pkg.inclusions.fixedItems.
                filter((i) => !i.toLowerCase().includes('playground')).
                map((item, idx) =>
                <ItemCard
                  key={idx}
                  title={item}
                  gradient="from-slate-200 to-slate-300"
                  badge={{
                    text: 'Included',
                    variant: 'included'
                  }} />

                )}
                </div>

                {hasChairsOrTables &&
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h4 className="font-bold text-brand-navy mb-4">
                      Extra Seating
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div>
                          <span className="font-medium text-brand-navy block">
                            Extra Kids Chairs
                          </span>
                          <span className="text-xs text-gray-500">
                            + AED {EXTRA_CHAIR_PRICE} each
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 bg-white rounded-lg border border-gray-200 p-1">
                          <button
                        onClick={() => updateExtra('chairs', -1)}
                        disabled={extras.chairs === 0}
                        className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center disabled:opacity-50 hover:bg-gray-100">
                        
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-6 text-center">
                            {extras.chairs}
                          </span>
                          <button
                        onClick={() => updateExtra('chairs', 1)}
                        className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center hover:bg-gray-100">
                        
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div>
                          <span className="font-medium text-brand-navy block">
                            Extra Kids Tables
                          </span>
                          <span className="text-xs text-gray-500">
                            + AED {EXTRA_TABLE_PRICE} each
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 bg-white rounded-lg border border-gray-200 p-1">
                          <button
                        onClick={() => updateExtra('tables', -1)}
                        disabled={extras.tables === 0}
                        className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center disabled:opacity-50 hover:bg-gray-100">
                        
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-6 text-center">
                            {extras.tables}
                          </span>
                          <button
                        onClick={() => updateExtra('tables', 1)}
                        className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center hover:bg-gray-100">
                        
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              }
              </section>
            }

            {/* 5. Complimentary Items */}
            {parsedFreeItems.length > 0 &&
            <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-bold text-2xl text-brand-navy">
                    Complimentary Gifts
                  </h2>
                  {hasFreeChoice &&
                <span className="text-sm font-medium text-gray-500">
                      Choose 1
                    </span>
                }
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {parsedFreeItems.map((item) =>
                <ItemCard
                  key={item.id}
                  title={item.name}
                  gradient={item.gradient}
                  badge={{
                    text: 'Free',
                    variant: 'free'
                  }}
                  selectable={item.isChoice}
                  selected={item.isChoice && selectedFreeItem === item.id}
                  onClick={
                  item.isChoice ?
                  () => setSelectedFreeItem(item.id) :
                  undefined
                  } />

                )}
                </div>
              </section>
            }
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
                  Please complete your selections to book.
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