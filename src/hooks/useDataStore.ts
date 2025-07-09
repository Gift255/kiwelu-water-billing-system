import { useState, useEffect } from 'react';
import { dataStore } from '@/data/globalData';

// Custom hook to use the data store with automatic re-rendering
export const useDataStore = () => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribers = [
      dataStore.subscribe('customers', () => forceUpdate({})),
      dataStore.subscribe('meterReadings', () => forceUpdate({})),
      dataStore.subscribe('invoices', () => forceUpdate({})),
      dataStore.subscribe('payments', () => forceUpdate({})),
      dataStore.subscribe('smsNotifications', () => forceUpdate({})),
      dataStore.subscribe('rateStructure', () => forceUpdate({}))
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  return dataStore;
};

// Specific hooks for different data types
export const useCustomers = () => {
  const [customers, setCustomers] = useState(dataStore.getCustomers());

  useEffect(() => {
    const unsubscribe = dataStore.subscribe('customers', () => {
      setCustomers(dataStore.getCustomers());
    });
    return unsubscribe;
  }, []);

  return customers;
};

export const useMeterReadings = () => {
  const [readings, setReadings] = useState(dataStore.getMeterReadings());

  useEffect(() => {
    const unsubscribe = dataStore.subscribe('meterReadings', () => {
      setReadings(dataStore.getMeterReadings());
    });
    return unsubscribe;
  }, []);

  return readings;
};

export const useInvoices = () => {
  const [invoices, setInvoices] = useState(dataStore.getInvoices());

  useEffect(() => {
    const unsubscribe = dataStore.subscribe('invoices', () => {
      setInvoices(dataStore.getInvoices());
    });
    return unsubscribe;
  }, []);

  return invoices;
};

export const usePayments = () => {
  const [payments, setPayments] = useState(dataStore.getPayments());

  useEffect(() => {
    const unsubscribe = dataStore.subscribe('payments', () => {
      setPayments(dataStore.getPayments());
    });
    return unsubscribe;
  }, []);

  return payments;
};

export const useSMSNotifications = () => {
  const [notifications, setNotifications] = useState(dataStore.getSMSNotifications());

  useEffect(() => {
    const unsubscribe = dataStore.subscribe('smsNotifications', () => {
      setNotifications(dataStore.getSMSNotifications());
    });
    return unsubscribe;
  }, []);

  return notifications;
};