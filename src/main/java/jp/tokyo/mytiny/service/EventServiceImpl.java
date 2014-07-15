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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component("eventService")
@Transactional
class EventServiceImpl implements EventService {

	private final EventRepository eventRepository;


	@Autowired
	public EventServiceImpl(EventRepository eventRepository) {
		this.eventRepository = eventRepository;
	}


	@Override
	public Page<Event> findEvent(EventSearchCriteria criteria, Pageable pageable) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public Page<Event> findAll(Pageable pageable) {
		return this.eventRepository.findAll(pageable);
	}


	@Override
	public Event findOne(long id) {
		return this.eventRepository.findOne(id);
	}


	@Override
	public Event save(Event event) {
		return this.eventRepository.save(event);
	}


	@Override
	public Event update(Event event) {
		return this.update(event);
	}


	@Override
	public void delete(long id) {
		this.eventRepository.delete(id);
	}


	@Override
	public Iterable<Event> findAll() {
		return this.eventRepository.findAll();
	}


//	@Override
//	public Event getEvent(String title, java.util.Date start, java.util.Date end) {
//		Assert.notNull(title, "Name must not be null");
//		//Assert.notNull(country, "Country must not be null");
//		//Assert.isTrue(expression, message);
//		return this.eventRepository.findByTitle(title);
//	}

}
