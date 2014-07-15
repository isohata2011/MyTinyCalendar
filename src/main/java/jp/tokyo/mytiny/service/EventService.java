/*
 * Copyright 2012-2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package jp.tokyo.mytiny.service;

import jp.tokyo.mytiny.domain.Event;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EventService {

	Iterable<Event> findAll();
	
	Page<Event> findAll(Pageable pageable);
	
	Page<Event> findEvent(EventSearchCriteria criteria, Pageable pageable);

	//Event getEvent(String title, java.util.Date start, java.util.Date end);
	Event findOne(long id);
	
	Event save(Event event);
	
	Event update(Event event);
	
	void delete(long id);
}
