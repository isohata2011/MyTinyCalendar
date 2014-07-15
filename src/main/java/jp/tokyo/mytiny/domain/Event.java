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

package jp.tokyo.mytiny.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * イベントを表すクラス
 * @author sohatach
 *
 */
@Entity
public class Event implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue
	private Long id;

	@Column(nullable = false)
	@NotEmpty
	private String title;

	@Column(nullable = true)
	@DateTimeFormat(pattern="YYYY/MM/dd HH:mm:ss")
	private java.util.Date startDatetime;

	@Column(nullable = true)
	@DateTimeFormat(pattern="YYYY/MM/dd HH:mm:ss")
	private java.util.Date endDatetime;

	public Event() {
	}

	public Event(String title, java.util.Date start, java.util.Date end) {
		super();
		this.title = title;
		this.startDatetime = start;
		this.endDatetime = end;
	}

	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public java.util.Date getStartDatetime() {
		return startDatetime;
	}

	public void setStartDatetime(java.util.Date startDatetime) {
		this.startDatetime = startDatetime;
	}

	public java.util.Date getEndDatetime() {
		return endDatetime;
	}

	public void setEndDatetime(java.util.Date endDatetime) {
		this.endDatetime = endDatetime;
	}

	@Override
	public String toString() {
		return getTitle() + "," + getStartDatetime() + "," + getEndDatetime();
	}
}
