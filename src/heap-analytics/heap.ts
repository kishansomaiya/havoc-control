import { isNil } from 'lodash';
import { UserObjectHeapAnalytics } from '../types/heapAnalyticsTypes';

export const initializeHeap = (analyticsId: string): void => {
    if (!analyticsId) {
        console.info('Heap Analytics ID is not provided.');
    }
    if (!document) {
        return;
    }

    const headTag = document.querySelector('head');

    const heapScriptTag = document.createElement('script');
    heapScriptTag.id = 'heap-analytics';
    heapScriptTag.innerHTML = `
		window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
		
		heap.load(${analyticsId});
    `;

    headTag?.appendChild(heapScriptTag);
};

export const isHeapInitialized = (): boolean => {
    return !isNil(window.heap);
};

export const logoutFromHeap = (): void => {
    try {
        if (!window.heap) {
            return;
        }
        window.heap.resetIdentity();
    } catch (e) {
        delete window.heap;
    }
};

export const loginToHeap = ({
    username,
    tenantName,
}: UserObjectHeapAnalytics): void => {
    if (!window.heap) {
        return;
    }
    if (window.heap.identity === username) {
        return;
    }
    window.heap.identify(username);
    window.heap.addUserProperties({ username, tenantName });
};

export const identifyUserInHeap = (userId: string): void => {
    if (!window.heap) {
        return;
    }
    window.heap.identify(userId);
};

export const trackCustomEvent = (
    eventName: string,
    eventData?: object
): void => {
    if (!window.heap) {
        return;
    }

    if (eventData) {
        window.heap.addEventProperties({ ...eventData });
    }
    window.heap.track(eventName);
    window.heap.clearEventProperties();
};

/**
 * Object for manipulating Heap Analytics.
 */
const oHeap = {
    initializeHeap,
    loginToHeap,
    logoutFromHeap,
    identifyUserInHeap,
    trackCustomEvent,
    isHeapInitialized,
};

export default oHeap;
